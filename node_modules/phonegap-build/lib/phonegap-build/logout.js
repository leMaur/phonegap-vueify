/*!
 * Module dependencies.
 */

var events = require('events'),
    config = require('../common/config');

/**
 * Logout.
 *
 * Logout the user by deleting the token key from the config file.
 *
 * Options:
 *
 *   - `args` {Object} is unused and should be `{}`.
 *   - [`callback`] {Function} is a callback function.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `error` is trigger on an error.
 *     - `e` {Error} details the error.
 */

module.exports = function(args, callback) {
    // require args parameter
    if (!args) {
        throw new Error('missing args parameter');
    }

    // optional callback
    callback = callback || function(e) {};

    // logout
    execute.call(this, args, callback);

    return this;
};

/*!
 * Execute Logout.
 */

var execute = function(args, callback) {
    var self = this;

    // read global config file
    config.global.load(function(e, data) {
        if (e) {
            self.emit('error', e);
            callback(e);
            return;
        }

        // log out by removing user auth token
        delete data.phonegap.token;
        config.global.save(data, function(e) {
            if (e) {
                self.emit('error', e);
                callback(e);
                return;
            }

            self.emit('log', 'logged out of', 'build.phonegap.com'.underline);
            callback(null);
        });
    });
};
