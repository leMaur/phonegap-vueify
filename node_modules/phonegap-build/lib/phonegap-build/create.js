/*!
 * Module dependencies.
 */

var events = require('events'),
    path = require('path');

/**
 * Create a New App.
 *
 * Creates an application on the local filesystem.
 * The remote application is created on-demand during the first build.
 *
 * Options:
 *
 *   - `options` {Object} is data required to create an app
 *     - `path` {String} is a directory path for the app.
 *   - [`callback`] {Function} is triggered after creating the app.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `error` is triggered on an error.
 *     - `e` {Error} details the error.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.path) throw new Error('requires option.path parameter');

    // optional callback
    callback = callback || function() {};

    // expand path
    options.path = path.resolve(options.path);

    // create app
    execute.call(this, options, callback);

    return this;
};

/*!
 * Define helper.
 */

module.exports.local = require('./create/local');

/*!
 * Execute.
 */

var execute = function(options, callback) {
    var self = this;

    // create local project
    module.exports.local({ path: options.path }, function(e) {
        if (e) {
            self.emit('error', e);
            callback(e);
            return;
        }

        callback(null);
    });
};
