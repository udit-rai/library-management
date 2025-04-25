import express from 'express';
import { delMember } from '../controllers/deleteController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Render Add Member Page
router.get('/del', isAdmin, (req, res) => {
    res.render('delMember');
});

// Handle Member Addition
router.post('/del', delMember);

export default router;
