import express from 'express';
import sql from 'mssql';
import config from '../config/dbConfig.js';

const router = express.Router();

// Search Route
router.post('/search', async (req, res) => {
    const { bookName } = req.body;

    if (!bookName) {
        return res.status(400).send("Book name is required.");
    }

    try {
        const pool = await sql.connect(config);

        // Query to search for the book by name in the Books table
        const result = await pool.request()
            .input('BookName', sql.VarChar, `%${bookName}%`) // Using % for LIKE
            .query(`
                SELECT ISBN, Title
                FROM Books
                WHERE Title LIKE @BookName
            `);

        // Regardless of whether the book is found, always redirect to Wikipedia
        const searchTerm = result.recordset.length > 0 ? result.recordset[0].Title : bookName;
        return res.redirect(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchTerm)}`);

    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).send("Server error");
    }
});

// Optional: GET route for showing the search page
router.get('/search', (req, res) => {
    res.render('search'); // This assumes views/search.ejs exists
});

export default router;
