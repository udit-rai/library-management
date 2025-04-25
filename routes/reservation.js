import express from 'express';
import { addReservation } from '../controllers/reservationController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Only logged-in users can post a reservation
router.post('/reservation/add', isAuthenticated, addReservation);

export default router;
