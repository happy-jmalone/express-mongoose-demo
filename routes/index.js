var express  = require('express');
var cors     = require('cors');
var router   = express.Router();


// CORS config
var corsConfig = {
    origin:         '*', // Any origin
    methods:        ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With']
}

// Basic index route
router.get('/', cors(corsConfig), function (request, response) {

    response.json({
        title: 'NodeJS / Express / Mongo(ose) Demo',
        author: 'Jake Malone <jmaloneweb@gmail.com>'
    });

});

module.exports = router;
