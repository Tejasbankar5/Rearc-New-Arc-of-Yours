import express from 'express';
import { generateArc, getDashboard, verifyTask, aiChat, toggleTask, getSetupConfig } from '../controllers/arc.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { aiGenerateLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { generateArcSchema, verifyTaskSchema } from '../lib/schemas.js';

const router = express.Router();

router.get('/setup-config', authMiddleware, getSetupConfig);
router.post('/generate', authMiddleware, aiGenerateLimiter, validateRequest(generateArcSchema), generateArc);
router.get('/dashboard', authMiddleware, getDashboard);
router.post('/verify-task', authMiddleware, validateRequest(verifyTaskSchema), verifyTask);
router.post('/chat', authMiddleware, aiChat);
router.patch('/tasks/:taskId/toggle', authMiddleware, toggleTask);

export default router;

