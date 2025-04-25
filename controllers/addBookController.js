import sql from 'mssql';
import config from '../config/dbConfig.js';

export const addBook = async (req, res) => {
    console.log("Received body:", req.body);

    const { isbn, coverpiclink, title } = req.body;

    if (!isbn || !coverpiclink || !title) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('ISBN', sql.VarChar, isbn)
            .input('CoverPicLink', sql.VarChar, coverpiclink)
            .input('Title', sql.VarChar, title)
            .query(`INSERT INTO Books (ISBN, CoverPicLink, Title) VALUES (@ISBN, @CoverPicLink, @Title)`);

        res.status(201).json({ message: "Book successfully added!" });
    } catch (err) {
        console.error("Error adding book:", err);
        res.status(500).json({ message: "Server error" });
    }
};
