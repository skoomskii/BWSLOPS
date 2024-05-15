// Import Modules
const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Data Models
const Code = require('../models/Codes');
const Pallet = require('../models/Pallet');
const Rack = require('../models/Rack');

// Home
router.get('/', (req, res) => res.render('../views/guest/welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('../views/user/dashboard', { user: req.user }));



//// Guest Handlers ////

// QA
router.get('/qa', (req, res, next) => { res.render('../views/guest/qadash'); });

// Production
router.get('/production', (req, res, next) => { res.render('../views/guest/prodash') });

// Production Actions
router.get('/search-production', async (req, res, next) => {
    switch (await req.query.Production) {
        case "Pallet Forms":
            return res.redirect('/palletform');
            break;
        case "Rack Forms":
            return res.redirect('/rackform');
            break;
        default:
            return res.redirect('/production');
    }
});

// Pallet Form Request
router.get('/palletform', (req, res, next) => { res.render('../views/guest/palletform'); });

// Submit Pallet Form
router.post('/new-pallet', async (req, res) => {
    const result = await Pallet.findOne({ FormID: await req.body.FormID });
    {
        // Duplicate Pallet
        if (result) {
            req.flash('error_msg', 'DUPLICATE: PALLET');
            res.redirect('/palletform');
            res.render = flash();
        }
        else {
            const rack = await Rack.findOne({ FormID: await req.body.FormID });
            {
                // Duplicate Rack
                if (rack) {
                    req.flash('error_msg', 'DUPLICATE: RACK');
                    res.redirect('/palletform');
                    res.render = flash();
                }
                else {
                    const valid = await Code.findOne({ FormID: await req.body.FormID });
                    {
                        // Valid QR
                        if (valid) {
                            const { FormID, Date, PN } = await req.body;
                            Pallet.create(({ FormID, Date, PN }));
                            req.flash('success_msg', 'SAVED');
                            res.redirect('/palletform');
                            res.render = flash();
                        }
                        // Invalid QR
                        else {
                            req.flash('error_msg', 'QR INVALID');
                            res.redirect('/palletform');
                            res.render = flash();
                        }
                    }
                }
            }
        }
    }
});

// Find Pallet Form
router.post('/find-pallet', async (req, res) => {
    const result = await Pallet.findOne({ FormID: await req.body.FormID });
    {
        // Found
        if (result) { res.render('../views/guest/palletfound', { data: result }); }
        // Not Found
        else {
            req.flash('error_msg', 'NOT FOUND');
            res.redirect('/palletform');
            res.render = flash();
        }
    }
});

// Rack Form Request
router.get('/rackform', (req, res, next) => { res.render('../views/guest/rackform'); });

// Submit Rack Form
router.post('/new-rack', async (req, res) => {
    const result = await Rack.findOne({ FormID: await req.body.FormID });
    {
        // Duplicate Rack
        if (result) {
            req.flash('error_msg', 'DUPLICATE: RACK');
            res.redirect('/rackform');
            res.render = flash();
        }
        else {
            const pallet = await Pallet.findOne({ FormID: await req.body.FormID });
            {
                // Duplicate Pallet
                if (pallet) {
                    req.flash('error_msg', 'DUPLICATE: PALLET');
                    res.redirect('/rackform');
                    res.render = flash();
                }
                else {
                    const valid = await Code.findOne({ FormID: await req.body.FormID });
                    {
                        // Valid QR
                        if (valid) {
                            const { FormID, Date, Time, RN } = await req.body;
                            Rack.create({ FormID, Date, Time, RN });
                            req.flash('success_msg', 'SAVED');
                            res.redirect('/rackform');
                            res.render = flash();
                        }
                        // Invalid QR Code
                        else {
                            req.flash('error_msg', 'QR INVALID');
                            res.redirect('/rackform');
                            res.render = flash();
                        }
                    }
                }
            }
        }
    }
});

// Find Rack Form
router.post('/find-rack', async (req, res) => {
    const result = await Rack.findOne({ FormID: await req.body.FormID });
    {
        // Found
        if (result) { res.render('../views/guest/rackfound', { data: result }); }
        // Not Found
        else {
            req.flash('error_msg', 'Not Found');
            res.redirect('/rackform');
            res.render = flash();
        }
    }
});

// Maintenance
router.get('/maintenance', (req, res, next) => { res.render('../views/guest/maindash'); });

// Maintenance Actions
router.get('/search-maintenance', async (req, res, next) => {
    switch (await req.query.Maintenance) {
        case "Inventory":
            return res.redirect('/inventory');
            break;
        case "Compressor Checklist":
            return res.redirect('/compchecklist');
            break;
        case "Utilities Checklist":
            return res.redirect('/utilchecklist');
        default:
            return res.redirect('/edit');
    }
});

// Inventory
router.get('/inventory', (req, res, next) => { res.render('../views/guest/inventory'); });

// News
router.get('/news', (req, res, next) => { res.render('../views/guest/newsdash'); });

// Schedule
router.get('/schedule', (req, res, next) => { res.render('../views/guest/caldash'); });



//// User Handlers ////

// QA
router.get('/users/qa', ensureAuthenticated, (req, res, next) => { res.render('../views/user/qadash'); });

// User Production
router.get('/users/production', ensureAuthenticated, (req, res, next) => { res.render('../views/user/prodash'); });

// Production Actions
router.get('/users/search-production', ensureAuthenticated, async (req, res, next) => {
    switch (await req.query.Production) {
        case "Pallet Forms":
            return res.redirect('/users/palletform');
            break;
        case "Rack Forms":
            return res.redirect('/users/rackform');
            break;
        default:
            return res.redirect('/users/production');
    }
});

// Pallet Form Request
router.get('/users/palletform', ensureAuthenticated, (req, res, next) => { res.render('../views/user/palletform'); });

// Submit Pallet Form
router.post('/users/new-pallet', ensureAuthenticated, async (req, res) => {
    const result = await Pallet.findOne({ FormID: await req.body.FormID });
    {
        // Duplicate Pallet
        if (result) {
            req.flash('error_msg', 'DUPLICATE: PALLET');
            res.redirect('/users/palletform');
            res.render = flash();
        }
        else {
            const rack = await Rack.findOne({ FormID: await req.body.FormID });
            {
                // Duplicate Rack
                if (rack) {
                    req.flash('error_msg', 'DUPLICATE: RACK');
                    res.redirect('/users/palletform');
                    res.render = flash();
                }
                else {
                    const valid = await Code.findOne({ FormID: await req.body.FormID });
                    {
                        // Valid QR
                        if (valid) {
                            const { FormID, Date, PN } = await req.body;
                            Pallet.create({ FormID, Date, PN });
                            req.flash('success_msg', 'SAVED');
                            res.redirect('/users/palletform');
                            res.render = flash();
                        }
                        // Invalid QR
                        else {
                            req.flash('error_msg', 'QR INVALID');
                            res.redirect('/users/palletform');
                            res.render = flash();
                        }
                    }
                }
            }
        }
    }
});

// Find Pallet Form
router.post('/users/find-pallet', ensureAuthenticated, async (req, res) => {
    const result = await Pallet.findOne({ FormID: await req.body.FormID });
    {
        // Found
        if (result) { res.render('../views/user/palletfound', { data: result }); }
        // Not Found
        else {
            req.flash('error_msg', 'NOT FOUND');
            res.redirect('/users/palletform');
            res.render = flash();
        }
    }
});

// Rack Form Request
router.get('/users/rackform', ensureAuthenticated, (req, res, next) => { res.render('../views/user/rackform'); });

// Submit Rack Form
router.post('/users/new-rack', ensureAuthenticated, async (req, res) => {
    const result = await Rack.findOne({ FormID: await req.body.FormID });
    {
        // Duplicate Rack
        if (result) {
            req.flash('error_msg', 'DUPLICATE: RACK');
            res.redirect('/users/rackform');
            res.render = flash();
        }
        else {
            const pallet = await Pallet.findOne({ FormID: await req.body.FormID });
            {
                // Duplicate Pallet
                if (pallet) {
                    req.flash('error_msg', 'DUPLICATE: PALLET');
                    res.redirect('/users/rackform');
                    res.render = flash();
                }
                else {
                    const valid = await Code.findOne({ FormID: await req.body.FormID });
                    {
                        // Valid QR
                        if (valid) {
                            const { FormID, Date, Time, RN } = await req.body;
                            Rack.create({ FormID, Date, Time, RN });
                            req.flash('success_msg', 'SAVED');
                            res.redirect('/users/rackform');
                            res.render = flash();
                        }
                        // Invalid QR Code
                        else {
                            req.flash('error_msg', 'QR INVALID');
                            res.redirect('/users/rackform');
                            res.render = flash();
                        }
                    }
                }
            }
        }
    }
});

// Find Rack Form
router.post('/users/find-rack', ensureAuthenticated, async (req, res) => {
    const result = await Rack.findOne({ FormID: await req.body.FormID });
    {
        // Found
        if (result) { res.render('../views/user/rackfound', { data: result }); }
        // Not Found
        else {
            req.flash('error_msg', 'NOT FOUND');
            res.redirect('/users/rackform');
            res.render = flash();
        }
    }
});

// Maintenance
router.get('/users/maintenance', ensureAuthenticated, (req, res, next) => { res.render('../views/user/maindash'); });

// Maintenance Actions
router.get('/users/search-maintenance', ensureAuthenticated, async (req, res, next) => {
    switch (await req.query.Maintenance) {
        case "Inventory":
            return res.redirect('/users/inventory');
            break;
        case "Compressor Checklist":
            return res.redirect('/users/compchecklist');
            break;
        case "Utilities Checklist":
            return res.redirect('/users/utilchecklist');
        default:
            return res.redirect('/users/edit');
    }
});

// Inventory
router.get('/users/inventory', ensureAuthenticated, (req, res, next) => { res.render('../views/user/inventory'); });

// News
router.get('/users/news', ensureAuthenticated, (req, res, next) => { res.render('../views/user/newsdash'); });

// Schedule
router.get('/users/schedule', ensureAuthenticated, (req, res, next) => { res.render('../views/user/caldash'); });

// Editor
router.get('/users/edit', ensureAuthenticated, (req, res, next) => { res.render('../views/user/editor'); });

// Editor Actions
router.get('/users/search-editor', ensureAuthenticated, async (req, res, next) => {
    switch (await req.query.Editor) {
        case "Generate QR Codes":
            return res.redirect('/users/new-QR');
            break;
        case "Recycle QR Codes":
            return res.redirect('/users/recycle');
            break;
        default:
            return res.redirect('/users/edit');
    }
});

// New QR
router.get('/users/new-QR', ensureAuthenticated, (req, res, next) => {
    Code.create({FormID:'0'}).then(result => {
        result.FormID = result.id;
        result = result.save().then(data => {
            req.flash('success_msg', 'NEW QR ACTIVE');
            res.render('../views/user/newQR', { data: data });
            res.render = flash();
        });
    });
});

// Recycle QR
router.get('/users/recycle', ensureAuthenticated, (req, res, next) => { res.render('../views/user/recycle'); });
router.post('/users/recycle-qr', ensureAuthenticated, async (req, res) => {
    const rack = await Rack.findOne({ FormID: await req.body.FormID });
    {
        // Rack Exists
        if (rack) {
            await rack.deleteOne();
            req.flash('success_msg', 'RECYCLED');
            res.redirect('/users/recycle');
            res.render = flash();
        }
        else {
            const pallet = await Pallet.findOne({ FormID: await req.body.FormID });
            {
                // Pallet Exists
                if (pallet) {
                    await pallet.deleteOne();
                    req.flash('success_msg', 'RECYCLED');
                    res.redirect('/users/recycle');
                    res.render = flash();
                }
                // Already Recycled
                else {
                    req.flash('error_msg', 'READY');
                    res.redirect('/users/recycle');
                    res.render = flash();
                }
            }
            
        }
    }
});

// Delete QR
router.post('/users/delete-qr', ensureAuthenticated, async (req, res) => {
    const rack = await Rack.findOne({ FormID: await req.body.FormID });
    const pallet = await Pallet.findOne({ FormID: await req.body.FormID });
    const valid = await Code.findOne({ FormID: await req.body.FormID });
    // Delete Rack
    try { await rack.deleteOne(); } catch (e) { console.log(e); }
    finally {
        // Delete Pallet
        try { await pallet.deleteOne(); } catch (e) { console.log(e); }
        finally {
            // Delete Validity
            try { await valid.deleteOne(); } catch (e) { console.log(e); }
            finally {
                req.flash('success_msg', 'DELETED');
                res.redirect('/users/recycle');
                res.render = flash();
            }
        }
    }
});

module.exports = router;