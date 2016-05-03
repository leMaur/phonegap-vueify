/*!
 * Module dependencies.
 */

var events = require('events'),
    http = require('http'),
    localtunnel = require('localtunnel'),
    middleware = require('./middleware'),
    ip = require('./util/ip'),
    socketServer = require('./util/socket-server'),
    emitter = new events.EventEmitter(),
    fs = require('fs'),
    path = require('path'),
    browser = require('./middleware/browser'),
    crypto = require('crypto');

/**
 * Serve a PhoneGap app.
 *
 * Creates a local server to serve up the project. The intended
 * receiver is the PhoneGap App but any browser can consume the
 * content.
 *
 * Options:
 *
 *   - `[options]` {Object}
 *     - `[port]` {Number} is the server port (default: 3000).
 *     - all options available to phonegap() middleware.
 *
 * Events:
 *
 *   - `complete` is triggered when server starts.
 *     - `data` {Object}
 *       - `server` {http.Server} is the server running.
 *       - `address` {String} is the server address.
 *       - `port` {Number} is the server port.
 *   - `error` trigger when there is an error with the server or request.
 *     - `e` {Error} is null unless there is an error.
 *   - all events available to phonegap() middleware.
 *   - all events available to `http.Server`
 *
 * Return:
 *
 *   - {http.Server} instance that is also an event emitter.
 *
 * Example:
 *
 *     phonegap.listen()
 *             .on('complete', function(data) {
 *                 // server is now running
 *             })
 *             .on('error', function(e) {
 *                 // an error occured
 *             });
 */

module.exports = function(options) {
    var self = this;

    // optional parameters
    options = options || {};
    options.port = options.port || 3000;

    // generate unique application ID for project being served
    options.appID = crypto.randomBytes(16).toString('hex');

    // create the server
    var pg = middleware(options),
        server = http.createServer(pg);

    socketServer.attachConsole(server);

    // bind error
    server.on('error', function(e) {
        // bind to avoid crashing due to no error handler
    });

    // bind request
    server.on('request', function(req, res) {
        res.on('finish', function() {
            if ((/\/__api__\/autoreload/).test(req.url)) {
                if (options.verbose) {
                    server.emit('log', res.statusCode, req.url);
                }
            } else {
                server.emit('log', res.statusCode, req.url);
            }
        });
    });

    // bind complete
    server.on('listening', function() {
        var data = {
            address: 'unknown',
            addresses: ['unknown'],
            port: options.port,
            server: server
        };

        // find local IP addresses
        ip.address(function(e, address, addresses) {
            if (e) {
                server.emit('error', e);
            }

            data.address = address || data.address;
            data.addresses = addresses || data.addresses;
            data.addresses.forEach(function(a) {
                server.emit('log', 'listening on', a + ':' + data.port);
            });
            server.emit('complete', data);
        });

        if(options.localtunnel) {
            localtunnel(data.port, function(err, tunnel) {
                if (err) {
                    server.emit('error', 'Error in localtunnel ', err);
                }
                else {
                    server.emit('log', 'localtunnel :', tunnel.url);
                }
            });
        }
    });

    // keep track of sockets opened on each connection
    options.sockets = {};
    var nextSocketId = 0;

    // add each socket
    server.on('connection', function(socket) {
        var socketId = nextSocketId++;
        options.sockets[socketId] = socket;

        // delete socket from list when it closes
        socket.on('close', function() {
            delete options.sockets[socketId];
        });
    });

    server.closeServer = function(callback) {
        // close all open sockets
        for (var socketId in options.sockets) {
            options.sockets[socketId].destroy();
        }

        this.close(function() {
            if (callback) callback();
        });
    };

    // bind server close (shutdown)
    server.on('close', function() {
        // tell middleware that server is shutdown
        pg.emit('close');
    });

    // bind emitter to server
    pg.on('error', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('error');
        server.emit.apply(server, args);
    });

    pg.on('log', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('log');
        server.emit.apply(server, args);
    });

    // add browser as platform
    if (options.browser)
        browser.addBrowserPlatform(options);

    // start the server
    return server.listen(options.port);
};
