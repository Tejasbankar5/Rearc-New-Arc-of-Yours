import prisma from '../lib/prisma.js';
import { GoogleGenAI } from '@google/genai';

let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export const generateArc = async (req, res) => {
  try {
    const { targetField, goals, availableHours, weakAreas } = req.body;
    const userId = req.user.userId;

    if (!ai) return res.status(500).json({ error: 'AI not configured' });

    const prompt = `Act as an elite AI productivity mentor.
    Create a 30-day realistic, highly structured, progressive transformation plan for a user targeting ${targetField}.
    Goals: ${goals}.
    Available daily hours: ${availableHours}.
    Weak areas to focus on: ${weakAreas}.
    
    CRITICAL INSTRUCTIONS:
    - DO NOT REPEAT OR CLONE TASKS ACROSS DAYS. 
    - The schedule MUST EVOLVE across the month. 
    - Week 1: Basics, Week 2: Intermediate, Week 3: Advanced, Week 4: Integration/Projects.
    - Each day MUST be UNIQUE and logically progressive.
    
    Output MUST BE a valid JSON array of exactly 30 objects. Example format:
    [
      { "day": 1, "tasks": [{ "time": "08:00 AM", "description": "Learn Array Basics" }, { "time": "11:00 AM", "description": "Solve 5 Two-Sum Variations" }] },
      ...
    ]
    Return ONLY the JSON. No markdown backticks or explanations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an elite mentor. You output strict JSON without backticks.`,
      }
    });

    let planData;
    try {
      const text = response.text.trim();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      planData = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse AI JSON', e, response.text);
      return res.status(500).json({ error: 'Failed to generate a structured AI arc' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const arc = await prisma.arc.create({
      data: {
        userId,
        targetField,
        goals,
        availableHours: parseInt(availableHours),
        weakAreas,
        startDate,
        endDate,
      }
    });

    const tasksData = [];
    planData.forEach((dayPlan) => {
      const taskDate = new Date(startDate);
      taskDate.setDate(taskDate.getDate() + dayPlan.day - 1);

      dayPlan.tasks.forEach((t) => {
        tasksData.push({
          arcId: arc.id,
          date: taskDate,
          time: t.time,
          description: t.description,
        });
      });
    });

    await prisma.task.createMany({ data: tasksData });

    res.status(201).json({ message: 'Arc successfully generated!', arcId: arc.id });
  } catch (error) {
    console.error('Error generating arc:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const arc = await prisma.arc.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        tasks: {
          orderBy: [{ date: 'asc' }, { time: 'asc' }]
        },
        dailyLogs: {
          orderBy: { date: 'asc' }
        }
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, xp: true, level: true }
    });

    res.json({ arc, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

export const verifyTask = async (req, res) => {
  try {
    const { taskId, answer } = req.body;
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { arc: true }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (!ai) return res.status(500).json({ error: 'AI not configured' });

    const prompt = `Act as an elite, strict productivity and technical mentor.
    The user was supposed to complete: "${task.description}".
    They provided this verification explanation: "${answer}".
    
    Analyze their answer strictly. Evaluate:
    - Depth of understanding
    - Correctness / Technical Accuracy
    - Effort level (reject shallow answers like "done" or "I learned it")
    
    If the answer is too shallow or demonstrates no real effort/learning, set isAccepted to false.
    
    Provide:
    - isAccepted (boolean)
    - score (0 to 100) representing understanding
    - authenticity (0 to 100) representing how genuine the effort seems
    - strengths (array of strings)
    - weaknesses (array of strings)
    - advice (string)
    - feedback (short overall summary string)
    
    Return strict JSON: 
    {
      "isAccepted": true,
      "score": 85,
      "authenticity": 90,
      "strengths": ["Clear explanation"],
      "weaknesses": ["Missed edge cases"],
      "advice": "Consider edge cases next time.",
      "feedback": "Overall good, but can be deeper."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You output strict JSON. You are a strict mentor who rejects low effort.`,
      }
    });

    let result;
    try {
      const text = response.text.trim();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      result = JSON.parse(cleaned);
    } catch(e) {
      result = { 
        isAccepted: false, 
        score: 0, 
        authenticity: 0, 
        strengths: [], 
        weaknesses: [], 
        advice: "Failed to parse verification.", 
        feedback: "AI verification error." 
      };
    }

    if (!result.isAccepted) {
      return res.status(400).json({ error: 'Verification failed. Answer too shallow or incorrect.', result });
    }

    const xpEarned = result.score > 80 ? 50 : result.score > 50 ? 25 : 10;
    
    // Update task and user XP
    await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: true,
        aiVerified: true,
        confidenceScore: result.score,
        aiVerificationLog: JSON.stringify(result)
      }
    });

    // Handle leveling up: 1000 XP per level
    const userToUpdate = await prisma.user.findUnique({ where: { id: userId } });
    const newXp = userToUpdate.xp + xpEarned;
    const newLevel = Math.floor(newXp / 1000) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel
      }
    });

    res.json({ result, xpEarned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify task' });
  }
};

export const aiChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!ai) return res.status(500).json({ error: 'AI not configured' });

    const prompt = `Act as an elite software engineering and productivity AI assistant inside a platform called Rearc.
    Context about the user: ${JSON.stringify(context || {})}
    
    User message: "${message}"
    
    Respond directly to the user. Use markdown. Be concise, extremely helpful, and adapt to their current context (e.g., if they are on day 14 of an MLOps arc, give MLOps related advice).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an elite mentor AI. Keep responses under 300 words unless code is needed. Use markdown formatting.`,
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { arc: true }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.arc.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

    const newCompleted = !task.completed;

    await prisma.task.update({
      where: { id: taskId },
      data: { completed: newCompleted }
    });

    // Award/remove XP: 10 XP per simple toggle completion
    const xpDelta = newCompleted ? 10 : -10;
    const userRecord = await prisma.user.findUnique({ where: { id: userId } });
    const newXp = Math.max(0, userRecord.xp + xpDelta);
    const newLevel = Math.floor(newXp / 1000) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, level: newLevel }
    });

    res.json({ completed: newCompleted, xpDelta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
};

export const getSetupConfig = async (req, res) => {
  try {
    // This could eventually be fetched from a database or updated via an admin panel.
    const config = {
      presets: [
        'DSA + LeetCode',
        'MLOps Engineer',
        'Full Stack Dev',
        'System Design',
        'Data Science',
        'Cloud Architect'
      ],
      placeholders: {
        targetField: 'e.g. MLOps, Full Stack, DSA Mastery...',
        goals: 'e.g. Build 2 production projects and solve 100 medium LeetCode problems...',
        weakAreas: 'e.g. Recursion, System Design'
      },
      labels: {
        title: 'Configure Your',
        subtitle: 'The AI will generate a psychologically optimized 30-day roadmap tailored to your exact parameters.'
      }
    };
    
    res.json(config);
  } catch (error) {
    console.error('Error fetching setup config:', error);
    res.status(500).json({ error: 'Failed to fetch setup config' });
  }
};
