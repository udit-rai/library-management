import sql from 'mssql';
import config from '../config/dbConfig.js';

export const authenticateAdmin = async (req, res) => {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const pool = await sql.connect(config);

        // Query the database for the admin user
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .query('SELECT email FROM AdminLogins WHERE email = @email AND passwordHash = @passwordHash');

        // Check if a matching admin was found
        if (result.recordset.length > 0) {
            const admin = result.recordset[0];
            
            // Successful login — set the session for admin
            req.session.user = {
                email: admin.email,
                role: 'admin',  // Set the role as 'admin'
            };

            console.log('[ADMIN LOGIN SUCCESS] Session set:', req.session.user);

            // Save session and then redirect to the admin-only page (admin_index.html)
            req.session.save(err => {
                if (err) {
                    console.error('[SESSION SAVE ERROR]', err);
                    return res.status(500).json({ message: "Server error saving session" });
                }
                return res.redirect('/admin_index.html');  // Redirect to the protected admin page
            });
        } else {
            // Invalid admin credentials — return 401
            console.warn(`[LOGIN FAILED] Invalid attempt for admin email: ${email}`);
            return res.status(401).json({ message: "Invalid admin credentials!" });
        }

    } catch (error) {
        console.error("Admin auth error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
