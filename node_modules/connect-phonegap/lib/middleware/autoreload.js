/*!
 * Module dependencies.
 */

var gaze = require('gaze'),
    path = require('path'),
    useragent = require('./ext/useragent');

/**
 * AutoReload Middleware.
 *
 * Watches the file system for changes and notifies client.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `options.autoreload` {Boolean} to enable the middleware (default: true)
 */

module.exports = function(options) {
    var browserToggle = false,
        lastModified = Date.now(),
        watches = [ path.join(process.cwd(), 'www/**/*') ];

    // optional options parameter
    options = options || {};
    if (typeof options.autoreload !== 'boolean')
        options.autoreload = true;

    // enable AutoReload
    if (options.autoreload) {
        var watch = new gaze.Gaze(watches);

        // exposing watch to browser middleware
        options.watch = watch;

        watch.on('error', function(e) {
            if (options.emitter) {
                options.emitter.emit('error', e);
            }
        });

        // flag as outdated on all local file system changes
        watch.on('all', function(event, filepath) {
            lastModified = Date.now();

            options.filesToUpdate.push([Date.now(), filepath]);

            if (options.emitter) {
                options.emitter.emit('log', 'file changed', filepath);
            }
        });

        // stop watching when the server shutsdown
        options.emitter.on('close', function() {
            watch.close();
        });

        options.emitter.on('browserPrepare', function() {
            browserToggle = true;
        });
    }

    // the app constantly polls the server checking for the outdated state
    // if the app detects the outdated state to be true, it will force a reload on the page
    return function(req, res, next) {
        if (req.url.indexOf('/__api__/autoreload') === 0) {
            if (req.method === 'GET') {
                // by default, lastUpdated is undefined.
                // on the first non-autoreload request, it is timestamped.
                // when the first request is to autoreload, we timestamp
                // it to 0 because no content has ever been retrieved,
                // which means that the content on the device is out-of-date.
                if (!req.session.lastUpdated) {
                    req.session.lastUpdated = 0;
                }
            }
            else if (req.method === 'POST'){
                req.session.lastUpdated = Date.now();
            }

            if (browserToggle && useragent.parse(req.headers['user-agent']).platform === 'browser') {
                req.session.lastUpdated = 0;
                browserToggle = false;
            }

            res.writeHead(200, { 'Content-Type': 'text/json' });
            res.end(JSON.stringify({
                content: {
                    lastModified: lastModified,
                    lastUpdated: req.session.lastUpdated,
                    outdated: (req.session.lastUpdated < lastModified)
                },
                projectChanged: (options.appID !== require('url').parse(req.url, true).query.appID)
            }));
        }
        else {
            // when lastUpdated is undefined, set it as up-to-date
            // since a legit resource request is going through
            if (!req.session.lastUpdated) {
                req.session.lastUpdated = Date.now();
            }
            next();
        }
    };
};
