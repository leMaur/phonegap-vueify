/*!
 * Module dependencies.
 */

var fs = require('fs'),
    archiver = require('archiver'),
    path = require('path'),
    util = require('util');

/**
 * Middleware to compress the changes to the project as a delta update
 *
 * Options:
 *
 *   - `options` {Object}
 *   - `options.req` {Object} is the request object (for session access).
 */

module.exports = function(options) {
    return function(req, res, next) {
        if (req.url.indexOf('/__api__/update') === 0) {
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

                // append application ID to request url
                scripts = scripts.replace(/\/__api__\/autoreload/, '/__api__/autoreload?appID=' + options.appID);

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

            var archive = archiver('zip', { store: false });

            archive.on('error', function(err) {
                console.error('Error, could not complete to zip up the app:');
                console.error(err.stack);
                res.end();
            });

            res.writeHead(200, { 'Content-Type': 'application/zip' } );
            archive.pipe(res);

            if(!req.session.lastFlush) {
                req.session.lastFlush = 0;
            }

            // first find where the indices we need to update in options.filesToUpdate
            var lastUpdatedIndex = 0;
            for (var i = 0; i < options.filesToUpdate.length; i++) {
                if (req.session.lastFlush < options.filesToUpdate[i][0]) {
                    lastUpdatedIndex = i;
                }
            }

            for (var i = lastUpdatedIndex; i < options.filesToUpdate.length; i++) {
                var filename = options.filesToUpdate[i][1];
                var output = filename.split(process.cwd())[1];

                if (path.extname(filename) === '.html') {
                    var htmlStreamFile = fs.createReadStream(filename);
                    var injectorTransform = new InjectHTML();
                    htmlStreamFile.pipe(injectorTransform);

                    archive.append(injectorTransform, { name: output });
                }
                else {
                    archive.append(fs.createReadStream(filename), { name: output });
                }
            }

            req.session.lastFlush = Date.now();

            archive.finalize();

        } 
        else {
            next();
        }
    }
};
