const mongoose = require('mongoose');

const RackSchema = 
    {
    FormID: { type: String, required: true },
    Date: { type: String, required: true },
    Time: { type: String, required: true },
    RN: { type: String, required: true }
    };

module.exports = mongoose.model('Rack', RackSchema, 'Racks');