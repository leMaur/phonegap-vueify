# connect-phonegap [![Build Status][travis-ci-img]][travis-ci-url] [![bitHound Score][bithound-img]][bithound-url]

> Connect middleware to serve a PhoneGap app.

## Examples

### Standalone

    var phonegap = require('connect-phonegap');
    phonegap.listen();

### Express

    var phonegap = require('connect-phonegap'),
        express = require('express'),
        app = express();

    app.use(phonegap());
    app.listen(3000);

### Connect

    var phonegap = require('connect-phonegap'),
        connect = require('connect'),
        app = connect();

    app.use(phonegap());
    app.listen(3000);

### HTTP

    var phonegap = require('connect-phonegap'),
        http = require('http');

    var server = http.createServer(phonegap());
    server.listen(3000);

## API

    var phonegap = require('connect-phonegap');

### phonegap()

Options:

  - `[options]` {Object}
  - `[autoreload]` {Boolean} toggle AutoReload watch (default: true).
  - `[localtunnel]` {Boolean} toggle localtunnel (default: false).

Events:

  - `error` is emitted when an error occurs.
  - `log` is emitted with log info.

Return:

  - {Function} request listener that can be provided to `http.Server` or
    used as `connect` middleware.

Example:

    var phonegap = require('connect-phonegap')(),
        middleware = phonegap();

    // subscribe to events
    middleware.on('log', function() {
        console.log.apply(this, arguments);
    });

    // use as middleware
    app.use(middleware);

    // or

    // use as request listener
    http.createServer(middleware).listen(3000);

### phonegap.listen(options, [callback])
### phonegap.serve(options, [callback])

Creates a local server to serve up the project. The intended
receiver is the PhoneGap App but any browser can consume the
content.

Options:

  - `[options]`
    - `[port]` {Number} to listen on (Default: 3000).
    - all options available to phonegap() middleware.

Events:

   - `complete` is triggered when server starts.
    - `data` {Object}
      - `server` {http.Server} is the server running.
      - `address` {String} is the server address.
      - `port` {Number} is the server port.
  - `error` trigger when there is an error with the server or request.
    - `e` {Error} is null unless there is an error.
  - all events available to phonegap() middleware.
  - all events available to `http.Server`

Return:

  - {http.Server} instance that is also an event emitter.

Example:

    phonegap.listen()
            .on('complete', function(data) {
                // server is now running
            })
            .on('error', function(e) {
                // an error occured
            });

### phonegap.create(options)

The project is created from the same app template used by the PhoneGap CLI
and Cordova CLI. When a template does not exist, it is fetched and saved
in the common directory:

    ~/.cordova/lib/www/phonegap/VERSION/

Options:

  - `options` {Object}
    - `path` {String} is the path to create the project.
    - `version` {String} defines the PhoneGap app version.

Events:

  - `progress` emits state while downloading the app template.
    - `state` {Object} with `received`, `total`, and `percentage`.
  - `error` emitted when an error occurs.
    - `e` {Error}
  - `complete` emits when the project has been created.
    - `data` {Object} is indentical to the input `options`.

Example:

    phonegap.create({
        path: 'path/to/app',
        version: '3.3.0'
    })
    .on('progress', function(state) {
        // only emitted when downloading a template.
        // state values are only defined when response supports
        // content-length header.
        if (state.percentage) {
            console.log('downloaded: ' + state.percentage + '%');
        }
    })
    .on('error', function(e) {
        // handle error
        console.log('error:', e);
    })
    .on('complete', function(data) {
        // data.path is the app path
        console.log('created project at: ' + data.path);
    });

[travis-ci-img]: https://travis-ci.org/phonegap/connect-phonegap.svg?branch=master
[travis-ci-url]: http://travis-ci.org/phonegap/connect-phonegap
[bithound-img]: https://www.bithound.io/github/phonegap/connect-phonegap/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/connect-phonegap
