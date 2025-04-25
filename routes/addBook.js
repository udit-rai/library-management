import express from 'express';
import { addBook } from '../controllers/addBookController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Render Add Book Page
router.get('/add', isAdmin, (req, res) => {
    res.render('addBook'); // Make sure 'addBook.ejs' exists in the views folder
});

// Handle Book Addition
router.post('/add', addBook);

export default router;
