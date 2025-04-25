import express from 'express';
import { addMember } from '../controllers/memberController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Render Add Member Page
router.get('/add', isAdmin, (req, res) => {
    res.render('addMember');
});

// Handle Member Addition
router.post('/add', addMember);

export default router;
