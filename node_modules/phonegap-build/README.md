# PhoneGap Build Node Module [![Build Status][travis-ci-img]][travis-ci-url] [![bitHound Score][bithound-img]][bithound-url]

> Node module to create and build PhoneGap projects with PhoneGap Build.

## Getting Started

### Install

`package.json`:

    {
        "dependencies": {
            "phonegap-build": "*"
        }
    }

### Require

    var phonegapbuild = require('phonegap-build');

## API

### Login

> Authenticates with PhoneGap Build, saves the token, and return an API object.
> When the save token exists, the authentication step is skipped.

Options:

  - `options` {Object} contains the login credentials.
  - [`options.username`] {String} is the username.
  - [`options.password`] {String} is the password.
  - [`options.protocol`] `{String}` optional server protocol. e.g. 'https:'.
  - [`options.host`] `{String}` optional server host. e.g. 'build.phonegap.com:'.
  - [`options.port`] `{String}` optional server port. e.g. '443'.
  - [`options.path`] `{String}` optional server path prefix. e.g. '/api/v1'.
  - [`options.proxy`] `{String}` specifies an optional proxy server. e.g. 'http://myproxy.com:8181'.
  - [`callback`] {Function} is called after the login.
    - `e` {Error} is null on a successful login attempt.
    - `api` {Object} the API object defined by phonegap-build-rest

Events:

  - `login` is triggered when login credentials are required.
  - `error` is triggered on an error.
    - `e` {Error} details the error.
  - `log` is triggered with log messages.
  - `warn` is triggered with warning messages.

Examples:

    //
    // given the login credentials
    //

    var options = { username: 'mwbrooks@adobe.com', password: 'abc123' };

    phonegapbuild.login(data, function(e, api) {
        // now logged in
    });

    //
    // get login credentials on demand
    //

    phonegapbuild.on('login', function(options, callback) {
        options.username = options.username || 'mwbrooks@adobe.com';
        options.password = options.password || 'abc123';
        callback(null, options);
    });

    phonegapbuild.login(function(e, api) {
        // now logged in
    });

### Login Event

> This event is called whenever a task must authenticate with PhoneGap/Build
> and the credentials are unknown. If only the username or only the password
> is known, the it is passed into the event as the `options` object.

> The developer should listen on this event and correctly retrieve the login
> credentials: looking them up from storage or prompting the user. Once
> the credentials are found, the `callback` can be fired with the correct
> credentials.

Options:

  - `options` {Object} contains the known login credentials.
  - [`options.username`] {String} is null or the username.
  - [`options.password`] {String} is null or the password.
  - `callback` {Function} is called with the correct credentials.
    - `e` {Error} is null or the error that occured.
    - `options` {Object} is the correct username and password.

Examples:

    phonegapbuild.on('login', function(options, callback) {
        options.username = options.username || 'mwbrooks@adobe.com';
        options.password = options.password || 'abc123';
        callback(null, options);
    });

### Logout

> Logout the user by deleting the token key from the config file.

Options:

  - `args` {Object} is unused and should be `{}`.
  - [`callback`] {Function} is a callback function.
    - `e` {Error} is null unless there is an error.

Events:

  - `error` is trigger on an error.
    - `e` {Error} details the error.

Examples:

    phonegapbuild.logout({}, function(e) {
        // now logged out unless e is defined
    });

### Create an App

> Creates an application on the local filesystem.
> The remote application is created on-demand during the first build.

Options:

  - `options` {Object} is data required to create an app
    - `path` {String} is a directory path for the app.
  - [`callback`] {Function} is triggered after creating the app.
    - `e` {Error} is null unless there is an error.

Events:

  - `error` is triggered on an error.
    - `e` {Error} details the error.

Examples:

    var options = { path: '~/development/my-app' };

    phonegapbuild.create(options, function(e) {
        if (e) {
            console.error('failed to create the project:', e.message);
        }
        else {
            console.log('created the project:', path);
        }
    });

### Build an App

> Builds the application using PhoneGap/Build. If the application does not
> exist, then it is first created. Currently, the build task only supports
> file transfers (zip) but will be extended to git repositories in the future.

Options:

  - `options` {Object} is data required for building a platform.
  - `options.platforms` {Array} is a collection of platform names {String} that
  - [`options.protocol`] `{String}` optional server protocol. e.g. 'https:'.
  - [`options.host`] `{String}` optional server host. e.g. 'build.phonegap.com:'.
  - [`options.port`] `{String}` optional server port. e.g. '443'.
  - [`options.path`] `{String}` optional server path prefix. e.g. '/api/v1'.
  - [`options.proxy`] `{String}` specifies an optional proxy server. e.g. 'http://myproxy.com:8181'.
                        specify the platforms to build.
  - [`callback`] {Function} is triggered after the build is complete.
    - `e` {Error} is null unless there is an error.
    - `data` {Object} describes the built app.

Events:

  - `error` is trigger on an error.
    - `e` {Error} details the error.

Examples:

    var options = { platforms: ['android'] };

    phonegapbuild.build(options, function(e, data) {
        if (e) {
            console.error('failed to build the app:', e);
        }
        else {
            console.log('successfully built the app:', data);
        }
    });

[travis-ci-img]: https://travis-ci.org/phonegap/node-phonegap-build.svg?branch=master
[travis-ci-url]: https://travis-ci.org/phonegap/node-phonegap-build
[bithound-img]: https://www.bithound.io/github/phonegap/node-phonegap-build/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/node-phonegap-build

