import { Router } from 'express';
import { body } from 'express-validator';
import userAuthController from '../controllers/authController';
import profileController from '../controllers/profileController';
import weightController from '../controllers/weightController';
import {
  healthCheck,
  readinessCheck,
  livenessCheck,
} from '../controllers/healthController';
import authMiddleware from '../middleware/authMiddleware';
import {
  authLimiter,
  apiLimiter,
  weightCreateLimiter,
  weightDeleteLimiter,
} from '../middleware/rateLimiter';

const router = Router();

// Health check endpoints (без rate limiting)
router.get('/health', healthCheck);
router.get('/ready', readinessCheck);
router.get('/live', livenessCheck);

// Аутентификация с строгим rate limiting
router.post(
  '/registration',
  authLimiter,
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 32 }),
  body('firstName').optional().isLength({ min: 2, max: 50 }),
  body('lastName').optional().isLength({ min: 2, max: 50 }),
  body('dateOfBirth').optional().isISO8601(),
  body('height').optional().isFloat({ min: 100, max: 250 }),
  body('gender').optional().isIn(['male', 'female']),
  userAuthController.registration
);
router.post('/login', authLimiter, userAuthController.login);
router.post('/logout', apiLimiter, userAuthController.logout);

router.get('/activate/:link', authLimiter, userAuthController.activate);
router.get('/refresh', apiLimiter, userAuthController.refresh);

// Вес с соответствующими лимитами
router.get(
  '/weight/simple-average',
  apiLimiter,
  authMiddleware,
  weightController.getSimpleMovingAvg as any
);
router.get(
  '/weight',
  apiLimiter,
  authMiddleware,
  weightController.getAll as any
);
router.post(
  '/weight',
  weightCreateLimiter,
  authMiddleware,
  weightController.create as any
);
router.delete(
  '/weight',
  weightDeleteLimiter,
  authMiddleware,
  weightController.removeLastEntry as any
);
router.delete(
  '/weight/:id',
  weightDeleteLimiter,
  authMiddleware,
  weightController.deleteEntry as any
);

router.post(
  '/edit-profile',
  apiLimiter,
  authMiddleware,
  profileController.editProfileData as any
);

export default router;
