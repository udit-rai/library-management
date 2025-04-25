import express from 'express';
import { authenticateAdmin } from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import path from 'path';  // Add this import for 'path'
import { fileURLToPath } from 'url'; // Make sure this is imported
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Admin login route
router.post('/admin/auth', authenticateAdmin);

// Protected admin route (redirect to admin_index.html after successful login)
router.get('/admin_index.html', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/admin_index.html'));  // Serve the admin page
});

export default router;
