/*!
 * Module dependencies.
 */

var fs = require('fs'),
    archiver = require('archiver'),
    path = require('path'),
    walk = require('walkdir'),
    util = require('util');

/**
 * Middleware to compress the app as a zip archive.
 *
 * Starting in PhoneGap Developer App 1.4.0, a zip archive is returned
 * to the client. The client will uncompress this archive to deploy the
 * app on the device. This middleware will compress and return the archive
 * on each request.
 *
 * Options:
 *
 *   - `options` {Object}
 *   - `options.req` {Object} is the request object (for session access).
 */

module.exports = function(options) {
    return function(req, res, next) {
        if (req.url.indexOf('/__api__/appzip') === 0) {
            // ios wants to ping the appzip end route with a HEAD request,
            // so send back a 200 to let it know that this url is valid
            if (req.method === 'HEAD') {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end();
            } else if(req.method === 'GET') {
                options.req = req;

                var resPath = path.join(__dirname, '../../res/middleware');

                // helper function that returns the scripts to inject into each HTML page
                var injectScript = function() {
                    var deployScript = path.join(resPath, 'deploy.js'),
                        autoreloadScript = path.join(resPath, 'autoreload.js'),
                        consoleScript = path.join(resPath, 'consoler.js'),
                        homepageScript = path.join(resPath, 'homepage.js'),
                        refreshScript = path.join(resPath, 'refresh.js');

                    var scripts = fs.readFileSync(deployScript) +
                                  fs.readFileSync(autoreloadScript) +
                                  fs.readFileSync(consoleScript) +
                                  fs.readFileSync(homepageScript) +
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
                    // Inject our scripts at the bottom of the body tag
                    var newChunk = chunk.toString().replace('</body>', injectScript() + '\n</body>');

                    // Add or update the Content-Security-Policy to allow unsafe-inline scripts
                    var cspTag = "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src *; style-src 'self' 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'\">";
                    var cspRegex = /<meta.+Content-Security-Policy.+>/i;

                    if (cspRegex.test(newChunk)) {
                        newChunk = newChunk.replace(cspRegex, cspTag);
                    }
                    else {
                        newChunk = newChunk.replace('</head>', cspTag + '\n</head>');
                    }

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

                // Real paths mapped to their canonical symlinked path, if they have one.
                var realToSym = {};

                // Returns path containing canonical symlinks (if any).
                function pathWithSymlinks(path) {
                    var withSymlinks = path;
                    for (var real in realToSym) {
                        if (withSymlinks.indexOf(real) === 0) {
                            var symlink = realToSym[real];
                            withSymlinks = withSymlinks.replace(real, symlink);
                        }
                    }
                    return withSymlinks;
                };

                var theWalker = walk(path.join(process.cwd(), 'www'), {'follow_symlinks': true});

                theWalker.on('link', function(linked){
                    var realPath = fs.realpathSync(linked);
                    realToSym[realPath] = pathWithSymlinks(linked);
                });

                theWalker.on('file', function(filename){
                    var output = pathWithSymlinks(filename).split(process.cwd())[1];

                    if (path.extname(filename) === '.html') {
                        var htmlStreamFile = fs.createReadStream(filename);
                        var injectorTransform = new InjectHTML();
                        htmlStreamFile.pipe(injectorTransform);
                        archive.append(injectorTransform, { name: output });
                    }
                    else {
                        archive.append(fs.createReadStream(filename), { name: output });
                    }
                });

                theWalker.on('end', function(){
                    archive.finalize();
                });
            }
        }
        else {
            next();
        }
    };
};
