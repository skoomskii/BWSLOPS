// Import Modules
const express = require('express');
const bodyparser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
const connectDB = async () => {
    await mongoose.connect(db, {})
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));
}; connectDB();

// EJS
app.use(expressLayouts);
app.use(express.static("views"));
app.use(express.static("scripts"));
app.set('view engine', 'ejs');

// Body Parser Middleware
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb' }));

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Enable CORS
app.use(cors());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`CORS-Enabled Server Running on  ${PORT}`));