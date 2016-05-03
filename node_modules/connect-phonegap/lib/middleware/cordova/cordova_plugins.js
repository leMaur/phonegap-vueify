/*!
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path');

/**
 * cordova_plugins.js middleware.
 *
 * Serves the cordova_plugins.js file whenever it is missing.
 */

module.exports = function() {
    // return the request listener
    return function(req, res, next) {
        if (req.url.indexOf('cordova_plugins.js') >= 0) {
            var filepath = path.join(
                __dirname,
                '../../../res/middleware/cordova',
                req.session.device.version,
                req.session.device.platform,
                'cordova_plugins.js'
            );

            var data = fs.readFileSync(filepath);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(data);
        } else {
            next();
        }
    };
};
