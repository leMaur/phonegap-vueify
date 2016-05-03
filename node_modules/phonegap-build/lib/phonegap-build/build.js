/*!
 * Module dependencies.
 */

var events = require('events'),
    config = require('../common/config'),
    path = require('path');

/**
 * Build an app using PhoneGap Build.
 *
 * Builds the application using PhoneGap/Build. If the application does not
 * exist, then it is first created. Currently, the build task only supports
 * file transfers (zip) but will be extended to git repositories in the future.
 *
 * Options:
 *
 *   - `options` {Object} is data required for building a platform.
 *   - `options.platforms` {Array} is a collection of platform names {String} that
 *                         specify the platforms to build.
 *   - [`callback`] {Function} is triggered after the build is complete.
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object} describes the built app.
 *
 * Events:
 *
 *   - `error` is trigger on an error.
 *     - `e` {Error} details the error.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function() {};

    // build
    execute.call(this, options, callback);

    return this;
};

/*!
 * Helper modules.
 */

module.exports.create = require('./create/remote');
module.exports.build = require('./build/remote');

/*!
 * Execute.
 */

var execute = function(options, callback) {
    var self = this;

    // login and get api object
    self.login(options, function(e, api) {
        if (e) {
            callback(e);
            return;
        }

        // lookup app id
        config.local.load(function(e, data) {
            if (e) {
                self.emit('error', e);
                callback(e);
                return;
            }

            // required options to build
            options.emitter = self;
            options.api = api;

            // common callback
            var _callback = function(e, data) {
                if (e) {
                    self.emit('error', e);
                }
                callback(e, data);
            };

            // build app when id exists otherwise create app
            if (data.phonegap && data.phonegap.id) {
                module.exports.build(options, _callback);
            }
            else {
                module.exports.create(options, _callback);
            }
        });
    });
};
