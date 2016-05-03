/*!
 * Module dependencies.
 */
 
var fs = require('fs'),
    archiver = require('archiver'),
    path = require('path'),
    util = require('util');

/**
 *
 */
module.exports = function(options) {
    options.req = req;

    var resPath = path.join(__dirname, '../../res/middleware');

    // helper function that returns the scripts to inject into each HTML page
    var injectScript = function() {
        var deployScript = path.join(resPath, 'deploy.js'),
            autoreloadScript = path.join(resPath, 'autoreload.js'),
            consoleScript = path.join(resPath, 'consoler.js'),
            homepageScript = path.join(resPath, 'homepage.js'),
            pushScript = path.join(resPath, 'push.js'),
            refreshScript = path.join(resPath, 'refresh.js');

        var scripts = fs.readFileSync(deployScript) + 
                      fs.readFileSync(autoreloadScript) +
                      fs.readFileSync(consoleScript) +
                      fs.readFileSync(homepageScript) +
                      fs.readFileSync(pushScript) +
                      fs.readFileSync(refreshScript);

        // replace default server address with this server address
        return scripts.replace(/127\.0\.0\.1:3000/g, options.req.headers.host);
    };

    var Transform = require('stream').Transform;
    util.inherits(InjectHTML, Transform);

    function InjectHTML(options) {
        if (!(this instanceof InjectHTML)) {
            return new InjectHTML(options);
        }

        Transform.call(this, options);
    };

    InjectHTML.prototype._transform = function (chunk, encoding, callback) {
        var newChunk = chunk.toString().replace('<script type=\"text/javascript\" src=\"cordova.js\"></script>', '<script type=\"text/javascript\" src=\"cordova.js\"></script>' + injectScript() + '\n');
        this.push(newChunk);
        callback();
    };
};
