var express  = require('express');
var cors     = require('cors');
var mongoose = require('mongoose');
var User     = require('../models/User');
var router   = express.Router();


// CORS configs:
// When no ID is specified
var corsNoId = {
    origin:         '*', // Any origin
    methods:        ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With']
}

// When an ID is specified
var corsWithId = {
    origin:         '*', // Any origin
    methods:        ['GET', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With']
}

// Enable pre-flight request
router.options('/',    cors(corsNoId));
router.options('/:id', cors(corsWithId));


// *******************************************************
// GET all Users

router.get('/', cors(corsNoId), function (request, response, next) {

    User.find(function (error, users) {

        if (error) {
            return next(error);
        }

        response.json(users);
    });

});


// *******************************************************
// GET a specific User

router.get('/:id', cors(corsWithId), function (request, response, next) {

    User.findById(request.params.id, function (error, user) {

        if (error) {
            if (error.name == 'CastError' && error.kind == 'ObjectId') {
                response.status(400).json({
                    error: 'User ID not found'
                });
            } else {
                response.status(500).json({
                    error: 'Something went wrong'
                });
            }
            return;
        }

        response.json(user);
    });

});


// *******************************************************
// POST a new User

router.post('/', cors(corsNoId), function (request, response, next) {

    var newUser = request.body;

    // Do we have all required data for the new user?
    if (!newUser || !newUser.name || !newUser.email) {
        response.status(400).json({
            error: 'Name and E-mail are required'
        });
        return;
    }

    // Check data types
    if (typeof newUser.name != 'string' || typeof newUser.email != 'string') {
        response.status(400).json({
            error: 'Name and E-mail must be strings'
        });
        return;
    }

    // Check data validity.
    // Name must start and end with a letter, but can
    // contain a space, dash, or single apostrophe.
    var validName  = /^[a-z]+[a-z\-. ]+[A-Za-z]+$/i;
    var validEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (!validName.test(newUser.name) || !validEmail.test(newUser.email)) {
        response.status(400).json({
            error: 'Invalid Name or E-mail'
        });
        return;
    }

    // All good, create new record
    User.create(newUser, function (error, user) {

        if (error) {
            response.status(500).json({
                error: 'Could not create User'
            });
            return;
        }

        response.json(user);
    });

});


// *******************************************************
// DELETE a specific User

router.delete('/:id', cors(corsWithId), function (request, response, next) {

    User.findByIdAndRemove(request.params.id, function (error, user) {

        if (user == null) {
            response.status(400).json({
                error: 'User ID not found'
            });
            return;
        } else if (error) {
            response.status(500).json({
                error: 'Something went wrong'
            });
            return;
        }

        response.json(user);
    });

});


module.exports = router;