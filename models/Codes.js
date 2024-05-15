const mongoose = require('mongoose');

const CodeSchema = 
    {
    FormID: { type: String, required: true }
    };

module.exports = mongoose.model('Codes', CodeSchema, 'Codes');