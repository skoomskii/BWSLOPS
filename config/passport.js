const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      // Match user
        User.findOne({ username: username }).then(user =>
        {
            // User not found
            if (!user) { return done(null, false, { message: 'Invalid Credentials' }); }

            // User found
            else 
            {
                // Wrong Password
                if (password == user.password) { return done(null, user); }

                // Right Password
                else { return done(null, false, { message: 'Invalid Credentials' }); }
            }
      });
    })
  );

    passport.serializeUser((user, done) => { done(null, user.id); });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => { done(null, user); })
            .catch((error) => { throw error; });
    });
};