/*
 * Module dependencies.
 */

var config = require('../../common/config'),
    path = require('path'),
    zip = require('./zip'),
    fs = require('fs');

/**
 * Create remote application.
 *
 * Options:
 *
 *   - `options` {Object} is the remote application data.
 *   - `options.api` {Object} is the API object defined by phonegap-build-rest.
 *   - `options.emitter` {EventEmitter} is the parent's event emitter.
 *   - `callback` {Function} is the completion callback.
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object} describes the built app.
 */

module.exports = function(options, callback) {
    // require parameters
    if (!options) throw new Error('missing options parameter');
    if (!options.api) throw new Error('missing options.api parameter');
    if (!options.emitter) throw new Error('missing options.emitter parameter');
    if (!callback) throw new Error('missing callback parameter');

    // setup the zip input and output paths
    var paths = {
        root: process.cwd(),
        www: path.join(process.cwd(), 'www'),
        build: path.join(process.cwd(), 'build')
    };

    // find the config.xml path
    var configPath = path.join(paths.root, 'config.xml');
    if (!fs.existsSync(configPath)) {
        configPath = path.join(paths.www, 'config.xml');
    }

    // app name
    fs.readFile(configPath, 'utf8', function(e, data) {
        if (e) {
            callback(e);
            return;
        }

        var match = data.match(/<name>(.*)<\/name>/);
        var appName = (match) ? match[1] : null;

        if (!appName) {
            callback(new Error('Could not get application name from config.xml'));
            return;
        }

        // compress app for upload
        options.emitter.emit('log', 'compressing the app...');
        zip.compress(paths.www, paths.build, function(e, filename) {
            if (e) {
                callback(e);
                return;
            }

            // app url
            var url = '/apps';

            // post headers for phonegap build api
            var headers = {
                form: {
                    data: {
                        title: appName,
                        create_method: 'file'
                    },
                    file: filename
                }
            };

            // create app on phonegap build
            options.emitter.emit('log', 'uploading the app...');
            options.api.post(url, headers, function(e, response) {
                zip.cleanup(filename);

                if (e) {
                    callback(e);
                    return;
                }

                // update config.json
                config.local.load(function(e, data) {
                    if (e) {
                        callback(e);
                        return;
                    }

                    // add app id to config.json
                    data.phonegap = data.phonegap || {};
                    data.phonegap.id = response.id;

                    config.local.save(data, function(e) {
                        if (e) {
                            callback(e);
                            return;
                        }

                        var buildData = {
                            id: data.phonegap.id,
                            api: options.api,
                            platforms: options.platforms || ['android'] // @TODO Remove stub
                        };

                        // wait for the platform build to be completed
                        options.emitter.emit('log', 'building the app...');
                        module.exports.waitForComplete(buildData, function(e, data) {
                            if (e) {
                                callback(e);
                                return;
                            }

                            callback(null, data);
                        });
                    });
                });
            });
        });
    });
};

/**
 * Wait for Build to Complete
 *
 * Continually queries the application build status. When the specified platform
 * build status changes to `complete` or `error`, then trigger the callback.
 *
 * Options:
 *
 *   - `options` {Object} defines the application and platform to watch.
 *   - `options.api` {Object} is the api object to access phonegap build.
 *   - `options.id` {Number} is the app ID to query.
 *   - `options.platforms` {Array} is a set of platform names to watch.
 *   - `callback` {Function} is triggered when the build is finished.
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object} describes the built app.
 */

module.exports.waitForComplete = function(options, callback) {
    // required arguments
    if (!options) throw new Error('missing options parameter');
    if (!options.api) throw new Error('missing options.api parameter');
    if (!options.id) throw new Error('missing options.id parameter');
    if (!options.platforms) throw new Error('missing options.platforms parameter');
    if (!callback) throw new Error('missing callback parameter');

    var url = '/apps/' + options.id;
    var platform = options.platforms[0];

    // get the app info
    options.api.get(url, function(e, data) {
        if (e) {
            callback(e);
            return;
        }

        // lookup the progress of a specific platform
        var status = data.status[platform];

        // trigger callback with error because the app build progress has
        // an error state
        // @TODO is there a way to lookup info about the error?
        if (status === 'error') {
            callback(new Error('error occured while building the ' + platform + ' app'));
        }
        // trigger callback because the app has completed building
        else if (status === 'complete') {
            callback(null, data);
        }
        // pause to avoid slamming the API before re-checking the progress
        else {
            setTimeout(function() {
                module.exports.waitForComplete(options, callback);
            }, 5000);
        }
    });
};
