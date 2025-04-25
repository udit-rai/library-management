import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Checks if the user is logged in
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();  // User is logged in, proceed to the next middleware or route
    } else {
        console.warn(`[AUTH BLOCKED] Unauthorized access to ${req.originalUrl}`);
        // User is not logged in, redirect to the login page or show 404
        return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
    }
};

// ✅ Checks if the user is an admin
export const isAdmin = (req, res, next) => {
    if (req.session?.user?.role === 'admin') {
        return next();  // User is an admin, proceed
    } else {
        console.warn(`[ADMIN BLOCKED] Non-admin tried to access ${req.originalUrl}`);
        // If user is not admin, show 404 or redirect to a "Not Authorized" page
        return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
    }
};
