// controllers/reservationController.js

import sql from 'mssql';
import config from '../config/dbConfig.js';

export const addReservation = async (req, res) => {
    console.log("[DEBUG] Reservation form data received:", req.body);
    const { memberId, isbn } = req.body;

    if (!memberId || !isbn) {
        return res.status(400).json({ message: 'Member ID and ISBN are required.' });
    }

    try {
        const pool = await sql.connect(config);

        // Check if the book is already reserved (exists in the Reservations table)
        const existingReservation = await pool.request()
            .input('ISBN', sql.VarChar, isbn)
            .query(`
                SELECT * FROM Reservations WHERE ISBN = @ISBN
            `);

        if (existingReservation.recordset.length > 0) {
            return res.status(400).json({ message: 'Book is not available!' });
        }

        // Check if the book has been returned, and if its return date is after the borrow date
        const returnedBook = await pool.request()
            .input('ISBN', sql.VarChar, isbn)
            .query(`
                SELECT * FROM Returns WHERE ISBN = @ISBN
            `);

        // If the book is in Returns table, check the date
        if (returnedBook.recordset.length > 0) {
            const returnDate = new Date(returnedBook.recordset[0].dateOfReturn);
            const dateOfBorrow = new Date();

            if (returnDate >= dateOfBorrow) {
                return res.status(400).json({ message: 'Book is not available!' });
            }
        }

        // Proceed with adding the reservation if the book is available
        const dateOfBorrow = new Date();
        const dateOfReturn = new Date(dateOfBorrow);
        dateOfReturn.setDate(dateOfReturn.getDate() + 30); // Adding 30 days

        // Insert the new reservation into the database
        await pool.request()
            .input('MemberID', sql.Int, memberId)
            .input('ISBN', sql.VarChar, isbn)
            .input('DateOfBorrow', sql.Date, dateOfBorrow)
            .input('DateOfReturn', sql.Date, dateOfReturn)
            .query(`
                INSERT INTO Reservations (MemberID, ISBN, DateOfBorrow, DateOfReturn)
                VALUES (@MemberID, @ISBN, @DateOfBorrow, @DateOfReturn)
            `);

        console.log(`[RESERVATION SUCCESS] Member ${memberId} reserved book ${isbn}`);
        return res.status(201).json({ message: 'Reservation added successfully!' });
    } catch (error) {
        console.error('Error adding reservation:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};