const mongoose = require('mongoose');

const UserSchema =
{
    username: { type: String, required: true },
    password: { type: String, required: true }
}

module.exports = mongoose.model('User', UserSchema, 'Users');