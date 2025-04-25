import express from 'express';
import session from 'express-session';
import path from 'path';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import returnRoutes from './routes/return.js';
import { fileURLToPath } from 'url';
import { isAuthenticated } from './middlewares/authMiddleware.js';
import { isAdmin } from './middlewares/authMiddleware.js';  // Import isAdmin middleware
import reservationRoutes from './routes/reservation.js';
import searchRoutes from './routes/search.js';
import memberRoutes from './routes/member.js';
import delMemberRouter from './routes/delmember.js';
import addBookRouter from './routes/addBook.js';
import deleteBookRouter from './routes/delBook.js';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Initialize the app FIRST
const app = express();

// ✅ Then use middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Public routes
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', reservationRoutes); // Yes, even protected routes must be registered!
app.use('/', returnRoutes); // Yes, even protected routes must be registered!
app.use('/', searchRoutes); // Register the search route
app.use('/members', memberRoutes);
app.use('/members', delMemberRouter);
app.use('/books', addBookRouter);
app.use('/books', deleteBookRouter);



// Setting view engine for rendering result page
app.set('view engine', 'ejs');  // Assuming you are using EJS for views
app.set('views', path.join(__dirname, 'views'));

// Serve static files (if any)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Protected reservation routes
app.get('/search', isAuthenticated, (req, res) => {
    res.render('search'); // This correctly renders `views/search.ejs`
});

app.get('/reservation', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected/reservation.html'));
  });
  
  app.get('/return', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected/return.html'));
  });

// ✅ Protected user routes
app.get('/menu.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected/menu.html'));
});

// Admin login page
app.get('/admin_login.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected/admin_login.html'));
});


// ✅ Protected admin routes
app.get('/admin_index.html', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected/admin_index.html'));
});

app.get('/books/add', isAdmin, (req, res) => {
    res.render('addBook'); // Ensure views/addBook.ejs exists
});

app.get('/books/del', isAdmin, (req, res) => {
    res.render('deleteBook'); // Ensure views/deleteBook.ejs exists
});

// ✅ Protected member management routes
app.get('/members/add', isAdmin, (req, res) => {
    res.render('addMember'); // Ensure views/addMember.ejs exists
});

app.get('/members/del', isAdmin, (req, res) => {
    res.render('deleteMember'); // Ensure views/deleteMember.ejs exists
});

// Default homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('[LOGOUT ERROR]', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/'); // Redirect to the homepage or login page after logout
    });
});

app.use((req, res, next) => {
    console.log("Session data:", req.session); // Check if user data exists
    next();
});


// This should go LAST, after all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

export default app;
