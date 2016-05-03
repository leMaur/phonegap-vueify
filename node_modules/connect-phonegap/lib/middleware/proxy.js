/*!
 * Module dependencies.
 */

var httpProxy = require('http-proxy'),
    proxy = new httpProxy.createProxyServer();

/**
 * Cross-Origin Requests Middleware.
 *
 * Add support for cross-origin resource requests by proxying all of the requests
 * through this route. Each request includes an encoded path that is the original
 * URL.
 *
 * Options:
 *
 *   - `options` {Object} is unused.
 */

module.exports = function(options) {
    return function(req, res, next) {
        if (req.url.indexOf('/__api__/proxy/') === 0 || req.url.indexOf('/proxy/') === 0) {

            var url = decodeURIComponent(req.url.replace('/proxy/', ''));

            req.url = url;
            delete req.headers.host;
            proxy.web(req, res, { target: url },
                function error(err, req, res) {
                    options.emitter.emit('log', 'Proxy error for url: ' + url, error.message);
                    res.writeHead(err.code || 500);
                    res.end(error.message);
            });

        }
        else {
            next();
        }
    };
};
