const express = require('express');
const router = express.Router();

// Band Model
let Band = require('../models/band');
// User Model
let User = require('../models/user');

// Add Band
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_band', {
        title: 'Add Band'
    });

});

// Add Submit POST Route
router.post('/add', (req, res) => {
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('genre', 'Genre is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_band', {
            title: 'Add Band',
            errors: errors
        });
    } else {
        let band = new Band();
        band.name = req.body.name;
        band.genre = req.body.genre;
        band.origin = req.user._id;

        band.save((err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Band Added')
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Band.findById(req.params.id, (err, band) => {
        if (band.origin != req.user._id) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        } else {
            res.render('edit_band', {
                title: 'Edit Band',
                band: band
            });
        }
    });
});

// Update Submit POST Route
router.post('/edit/:id', (req, res) => {
    let band = {};
    band.name = req.body.name;
    band.genre = req.body.genre;
    band.origin = req.body.origin;

    let query = { _id: req.params.id }

    Band.update(query, band, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Band Updated')
            res.redirect('/');
        }
    });
});

// Delete
router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = { _id: req.params.id };

    Band.findById(req.params.id, (err, band) => {
        if (band.origin != req.user._id) {
            res.status(500).send();
        } else {
            Band.remove(query, (err) => {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

// Get Single Band
router.get('/:id', (req, res) => {
    Band.findById(req.params.id, (err, band) => {
        User.findById(band.origin, (err, user) => {
            res.render('band', {
                band: band,
                origin: user.name
            });
        });

    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}

module.exports = router;