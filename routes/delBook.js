import express from 'express';
import { deleteBook } from '../controllers/deleteBookController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Render Delete Book Page
router.get('/del', isAdmin,(req, res) => {
    res.render('delBook'); // Ensure 'deleteBook.ejs' is in the views folder
});

// Handle Book Deletion
router.post('/delete', deleteBook);

export default router;
