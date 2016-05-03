/*
 * Module dependencies.
 */

var request = require('request'),
    defaults = require('./defaults'),
    extend = require('./extend'),
    API = require('./api');

/**
 * Authentication for PhoneGap Build.
 *
 * Authenticates with PhoneGap Build to obtain an auth token. With the auth
 * token, an API instance in created and returned via the callback.
 *
 * Options:
 *
 *   - `options` {Object} is the authentication settings.
 *   - `options.username` {String} is the phonegap build username.
 *   - `options.password` {String} is the phonegap build password.
 *   - `options.token` {String} can be used instead of username and password.
 *   - `callback` {Function} is trigger after the authentication.
 *     - `e` {Error} is null unless there is an error.
 *     - `api` {Object} is the `API` instance to interact with phonegap build.
 */

module.exports = function(options, callback) {
    options = extend(defaults, options);

    // require options parameter
    if (!options) throw new Error('missing options argument');

    // return API if token parameter given
    if (options.token) {
        callback(null, new API(options));
        return;
    }

    // require options parameter credentials
    if (!options.username) throw new Error('missing options.name argument');
    if (!options.password) throw new Error('missing options.password argument');

    // require callback parameter
    if (!callback) throw new Error('missing callback argument');

    // url for authentication
    var uri = options.protocol + '//' + options.host + ':' + options.port + '/token';

    // post headers for authentication
    var opts = {
        headers: {
            'Authorization': headers.auth(options.username, options.password)
        },
        proxy: options.proxy
    };

    // try to authenticate
    request.post(uri, opts, function(e, response, body) {
        // failed request
        if (e) {
            callback(e);
            return;
        }

        // failed response
        if (response.statusCode !== 200) {
            // provide a default message when none is provided
            body = body || 'server returned status code ' + response.statusCode;
            callback(new Error(body));
            return;
        }

        // parse phonegap build response
        var data = JSON.parse(body);

        // failed api validation
        if (data.error) {
            callback(new Error(data.error));
            return;
        }

        // create API object
        options.token = data.token;
        options.username = undefined;
        options.password = undefined;
        callback(null, new API(options));
    });
};

var headers = {
    // Header for basic authorization
    auth: function(username, password) {
        var string = username + ':' + password;
        var buffer = new Buffer(string).toString('base64');
        return 'Basic ' + buffer;
    }
};
