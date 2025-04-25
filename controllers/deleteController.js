import sql from 'mssql';
import config from '../config/dbConfig.js';


export const delMember = async (req, res) => {
    console.log("Received headers:", req.headers);
    console.log("Received body:", req.body); // Check if data exists

    const { email } = req.body; // Remove name

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const pool = await sql.connect(config);
        console.log("Attempting to delete member:", email);

        await pool.request()
            .input('Email', sql.VarChar, email)
            .query(`DELETE FROM Members WHERE Email=@Email;`);

        await pool.request()
            .input('Email', sql.VarChar, email)
            .query(`DELETE FROM Logins WHERE Email=@Email;`);

        res.status(201).json({ message: "Member successfully deleted!" });
    } catch (err) {
        console.error("Error deleting member:", err);
        res.status(500).json({ message: "Server error" });
    }
};
