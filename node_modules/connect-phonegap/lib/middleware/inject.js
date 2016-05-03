/*!
 * Module dependencies.
 */

var fs = require('fs'),
    inject = require('connect-inject'),
    path = require('path');

/**
 * Middleware to inject JavaScript into the served app.
 *
 * Options:
 *
 *   - `options` {Object} contains all options available to other middleware.
 */

module.exports = function(options) {
    var scriptsToInject = [],
        scripts = [
        path.join(__dirname, '../../res/middleware/autoreload-http.js'),
        path.join(__dirname, '../../res/middleware/consoler-http.js'),
        path.join(__dirname, '../../res/middleware/homepage.js'),
        path.join(__dirname, '../../res/middleware/proxy.js'),
        path.join(__dirname, '../../res/middleware/push.js'),
        path.join(__dirname, '../../res/middleware/refresh.js')
    ];

    // read each scripts content, skipping those that are disabled
    scripts.forEach(function(script) {
        // skip autoreload script when it's disabled
        if (!options.autoreload && script.indexOf('autoreload') >= 0) {
            return;
        }
        scriptsToInject.push(fs.readFileSync(script));
    });

    return inject({
        snippet: scriptsToInject
    });
};
