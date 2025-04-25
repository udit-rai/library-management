import express from 'express';
import { addReturn } from '../controllers/returnController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Only logged-in users can post a return
router.post('/return/add', isAuthenticated, addReturn);

export default router;
