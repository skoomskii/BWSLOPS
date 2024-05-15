// Import Modules
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Home
router.get('/', (req, res, next) => { res.redirect('/welcome'); });

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('../views/guest/login'));

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(function (error) {
        if (error) { return next(error); }
        req.flash('success_msg', 'Logged Out');
        res.redirect('./login');
    });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res, next) => { res.redirect('/dashboard'); });

module.exports = router;