const mongoose = require('mongoose');

const PalletSchema = 
    {
    FormID: { type: String, required: true },
    Date: { type: String, required: true },
    PN: { type: String, required: true }
    };

module.exports = mongoose.model('Pallet', PalletSchema, 'Pallets');