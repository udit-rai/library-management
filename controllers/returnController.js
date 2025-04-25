import sql from 'mssql';
import config from '../config/dbConfig.js';

export const addReturn = async (req, res) => {
  const { userId, isbn } = req.body;

  console.log("[DEBUG] Received return form data:", req.body); // Log form data

  try {
    const pool = await sql.connect(config);

    // Fetch the reservation for the user and book to check if it's valid and not already returned
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ISBN', sql.VarChar, isbn)
      .query(`
        SELECT r.DateOfReturn AS ExpectedDateOfReturn, ret.DateOfReturn AS ActualDateOfReturn
        FROM reservations r
        LEFT JOIN returns ret ON r.MemberID = ret.UserID AND r.ISBN = ret.ISBN
        WHERE r.MemberID = @UserID AND r.ISBN = @ISBN
        ORDER BY r.DateOfBorrow DESC
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
      `);

    console.log("[DEBUG] Reservation result:", result.recordset); // Log the result from the database

    // If no reservation found, return an error
    if (result.recordset.length === 0) {
      console.log("[ERROR] No reservation found for this user and book.");
      return res.status(404).send('No reservation found for this user and book');
    }

    const reservation = result.recordset[0];
    const expectedDate = reservation.ExpectedDateOfReturn;
    const actualReturnDate = reservation.ActualDateOfReturn;

    // If the book has already been returned, return an error
    if (actualReturnDate) {
      console.log("[ERROR] This book has already been returned.");
      return res.status(400).send('This book has already been returned.');
    }

    console.log("[DEBUG] ExpectedDateOfReturn:", expectedDate);

    // Insert the return record with today's DateOfReturn and the fetched ExpectedDateOfReturn
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ISBN', sql.VarChar, isbn)
      .input('ExpectedDate', sql.Date, expectedDate)
      .input('ActualDate', sql.Date, new Date())  // Today's date
      .query(`
        INSERT INTO returns (UserID, ISBN, ExpectedDateOfReturn, DateOfReturn)
        VALUES (@UserID, @ISBN, @ExpectedDate, @ActualDate);
      `);

    console.log("[DEBUG] Return record added successfully for", userId, isbn);

    // Optionally redirect to a page or return a success response
    res.redirect('/menu.html');
  } catch (err) {
    console.error('[Add Return Error]', err);
    res.status(500).send('Server error adding return');
  }
};
