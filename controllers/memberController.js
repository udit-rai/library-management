import sql from 'mssql';
import config from '../config/dbConfig.js';

// Function to generate a random password
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};

// Add a new member
export const addMember = async (req, res) => {
    console.log("Received headers:", req.headers);
    console.log("Received body:", req.body); // Check if data exists
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required." });
    }

    try {
        const pool = await sql.connect(config);
        console.log("Attempting to add member:", name, email);
        const memberResult = await pool.request()
            .input('Name', sql.VarChar, name)
            .input('Email', sql.VarChar, email)
            .query(`
                INSERT INTO Members (Name, Email)
                OUTPUT INSERTED.UserID
                VALUES (@Name, @Email)
            `);
        console.log("Member successfully added:", memberResult.recordset);
        const userId = memberResult.recordset[0].UserID;
        const plainPassword = generatePassword();

        await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Email', sql.VarChar, email)
            .input('Password', sql.VarChar, plainPassword)
            .query(`
                INSERT INTO Logins (UserID, Email, PasswordHash)
                VALUES (@UserID, @Email, @Password)
            `);

            res.status(201).json({ message: "Member successfully added!" });
    } catch (err) {
        console.error("Error adding member:", err);
        res.status(500).json({ message: "Server error" });
    }
};
