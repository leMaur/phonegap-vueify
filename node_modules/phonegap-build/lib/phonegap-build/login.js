/*!
 * Module dependencies
 */

var events = require('events'),
    client = require('phonegap-build-api'),
    config = require('../common/config'),
    extend = require('../common/extend');

/**
 * Login.
 *
 * Authenticates with PhoneGap Build, saves the token, and return an API object.
 * When the save token exists, the authentication step is skipped.
 *
 * Options:
 *
 *   - `options` {Object} contains the login credentials.
 *   - [`options.username`] {String} is the username.
 *   - [`options.password`] {String} is the password.
 *   - [`callback`] {Function} is called after the login.
 *     - `e` {Error} is null on a successful login attempt.
 *     - `api` {Object} the API object defined by phonegap-build-rest
 *
 * Events:
 *
 *   - `error` is triggered on an error.
 *     - `e` {Error} details the error.
 *   - `login` is triggered when login credentials are required.
 *     - `options.username` is the known username or undefined.
 *     - `options.password` is the known password or undefined.
 *     - `callback` is called with credentials to log in.
 *       - `e` is undefined unless the creds cannot be provided.
 *       - `options.username` is the username to use.
 *       - `options.password` is the password to use.
 *   - `log` is triggered with log messages.
 *   - `warn` is triggered with warning messages.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires options parameter');

    // callback is optional
    callback = callback || function() {};

    // login
    execute.call(this, options, callback);

    return this;
};

/*!
 * Execute Login.
 */

var execute = function(options, callback) {
    var self = this;

    // check if account exists
    config.global.load(function(e, data) {
        // account exists with an auth token
        if (!e && data && data.phonegap && data.phonegap.token) {
            var apiOptions = extend(data.phonegap, options);

            // login with saved account
            var api = new client.API(apiOptions);

            callback(null, api);
        }
        // account does not exist
        else {
            // authenticate with given username and password
            if (options.username && options.password) {
                authenticate(options, callback);
            }
            // authenticate after retrieving missing username and/or password
            else {
                var loginOptions = {
                    username: options.username,
                    password: options.password
                };

                // console output
                self.emit('log', 'PhoneGap/Build Login');
                self.emit('log', 'Sign up at', 'build.phonegap.com'.underline);
                self.emit('warn', 'GitHub accounts are unsupported');

                // retrieve username and/or password
                self.emit('login', loginOptions, function(e, data) {
                    if (e) {
                        self.emit('error', e);
                        callback(e);
                        return;
                    }
                    authenticate(data, callback);
                });
            }
        }

        // authenticate with phonegap build api
        function authenticate(options, callback) {
            client.auth(options, function(e, api) {
                if (e) {
                    self.emit('error', e);
                    callback(e);
                    return;
                }

                // data
                data = data || {};
                data.phonegap = data.phonegap || {};
                data.phonegap.token = api.token;

                // save the data
                config.global.save(data, function(e) {
                    // do not provide api on error
                    if (e) {
                        self.emit('error', e);
                        callback(e);
                        return;
                    }

                    // complete
                    self.emit('log', 'logged in as', options.username);
                    callback(null, api);
                });
            });
        }
    });
};

