import sql from 'mssql';
import config from '../config/dbConfig.js';

export const deleteBook = async (req, res) => {
    console.log("Received body:", req.body);

    const { isbn } = req.body;

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required." });
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('ISBN', sql.VarChar, isbn)
            .query(`DELETE FROM Books WHERE ISBN=@ISBN;`);

        res.status(200).json({ message: "Book successfully deleted!" });
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).json({ message: "Server error" });
    }
};
