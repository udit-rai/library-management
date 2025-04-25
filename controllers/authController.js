import path from 'path';
import { fileURLToPath } from 'url';
import sql from 'mssql';
import config from '../config/dbConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const authenticateUser = async (req, res) => {
    // Destructure email and passwordHash from the request body
    const { email, passwordHash } = req.body;

    // Validate that both email and passwordHash are provided
    if (!email || !passwordHash) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Connect to the database
        let pool = await sql.connect(config);

        // Query the database to check for matching user credentials
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .query('SELECT email, passwordHash FROM Logins WHERE email = @email AND passwordHash = @passwordHash');

        console.log("Query result:", result.recordset);  // Log the query result

        // Check if the result contains a matching user
        if (result.recordset.length > 0) {
            // ✅ Successful login — set session user
            req.session.user = {
                email: result.recordset[0].email,
                role: 'user', // You can adjust this if you have different user roles
            };

            console.log('[LOGIN SUCCESS] Session set:', req.session.user);

            // Save session and then redirect to members-only page
            req.session.save(err => {
                if (err) {
                    console.error('[SESSION SAVE ERROR]', err);
                    return res.status(500).json({ message: "Server error saving session" });
                }
                console.log('[SESSION SAVE SUCCESS] Redirecting to /menu.html');
                // Redirect to the protected page (menu.html)
                return res.redirect('/menu.html');
            });
        } else {
            // ❌ Invalid credentials — return 401 if no matching user found
            console.warn(`[LOGIN FAILED] Invalid attempt for email: ${email}`);
            return res.status(401).json({ message: "Invalid email or password!" });
        }

    } catch (error) {
        // Log any database errors and return a server error response
        console.error('[DB ERROR]', error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
