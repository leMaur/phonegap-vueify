/*!
 * Module dependencies.
 */
 
var fs = require('fs'),
    path = require('path');

/**
 * plugins.js middleware.
 *
 * Serves the each of the cordova plugin files whenever it is missing.
 */

module.exports = function() {
    // return the request listener
    return function(req, res, next) {
        if (req.url.indexOf('plugins/') >= 0) {
            var pluginPath = req.url.split('plugins/')[1];
            var filepath = path.join(
                __dirname,
                '../../../res/middleware/cordova',
                req.session.device.version,
                req.session.device.platform,
                'plugins',
                pluginPath
            );

            var data = fs.readFileSync(filepath);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(data);
        } else {
            next();
        }
    };
};
