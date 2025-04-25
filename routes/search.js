import express from 'express';
import sql from 'mssql';
import config from '../config/dbConfig.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js'; // Import authentication

const router = express.Router();

router.post('/search', async (req, res) => {
    const { query } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('query', sql.VarChar, `%${query}%`)
            .query('SELECT * FROM Books WHERE Title LIKE @query');

            const searchTerm = result.recordset.length > 0 ? result.recordset[0].Title : query;
            res.redirect(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchTerm)}`);
            
    } catch (err) {
        console.error('[Search Error]', err);
        res.status(500).send('Server error');
    }
});

router.get('/search', isAuthenticated, (req, res) => {
    res.render('search'); // This assumes views/search.ejs exists
});

export default router;
