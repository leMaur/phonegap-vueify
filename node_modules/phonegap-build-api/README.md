# PhoneGap Build API Node Module [![Build Status][travis-ci-img]][travis-ci-url] [![bitHound Score][bithound-img]][bithound-url]

> Node.js REST Client for the PhoneGap Build API

## Overview

This library simplifies authentication and requests to the
[PhoneGap Build REST API][build-api-docs] for node.js clients.

In many ways, this library is little more than a convenience wrapper
for [mikeal's][github-mikeal] [request][github-request] library. You can expect
that all of [request's][github-request] functionality to be available to the
`API` object returned by `client.auth();`.

If something is inaccurate or missing, please send a pull request!

## Usage

### Authenticate with Username and Password

    var client = require('phonegap-build-api');

    client.auth({ username: 'zelda', password: 'tr1f0rce' }, function(e, api) {
        // time to make requests
    });

### Authenticate with Token

    var client = require('phonegap-build-api');

    client.auth({ token: 'abc123' }, function(e, api) {
        // time to make requests
    });

### GET /api/v1/me

    api.get('/me', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### GET /api/v1/apps

    api.get('/apps', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### GET /api/v1/apps/:id

    api.get('/apps/199692', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### GET /api/v1/apps/:id/icon

    api.get('/apps/199692/icon').pipe(fs.createWriteStream('icon.png'));

### GET /api/v1/apps/:id/:platform

    api.get('/apps/199692/android').pipe(fs.createWriteStream('app.apk'));

### GET /api/v1/keys

    api.get('/keys', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### GET /api/v1/keys/:platform

    api.get('/keys/ios', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### GET /api/v1/keys/:platform/:id

    api.get('/keys/ios/917', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /api/v1/apps

    var options = {
        form: {
            data: {
                title: 'My App',
                create_method: 'file'
            },
            file: '/path/to/app.zip'
        }
    };

    api.post('/apps', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### PUT /api/v1/apps/:id

    var options = {
        form: {
            data: {
                debug: false
            },
            file: '/path/to/app.zip'
        }
    };

    api.put('/apps/197196', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /api/v1/apps/:id/icon

    var options = {
        form: {
            icon: 'my-icon.png'
        }
    };

    api.post('/apps/232741/icon', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /api/v1/apps/:id/build

Build all platforms:

    api.post('/apps/232741/build', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

Build specific platforms:

    var options = {
        form: {
            data: {
                platforms: [ 'android', 'blackberry', 'ios', 'winphone', 'webos' ]
            }
        }
    };

    api.post('/apps/232741/build', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /api/v1/apps/:id/build/:platform

    api.post('/apps/232741/build/android', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /api/v1/apps/:id/collaborators

    var options = {
        form: {
            data: {
                email: 'michael@michaelbrooks.ca',
                role: 'dev'
            }
        }
    };

    api.post('/apps/232741/collaborators', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### PUT /api/v1/apps/:id/collaborators/:id

    var options = {
        form: {
            data: {
                role: 'tester'
            }
        }
    };

    api.put('/apps/232741/collaborators/263955', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### POST /api/v1/keys/:platform

    var options = {
        form: {
            data: {
                title: 'My BlackBerry Signing Key',
                password: 'my-password'
            },
            db: '/path/to/sigtool.db',
            csk: '/path/to/sigtool.csk'
        }
    };

    api.post('/keys/blackberry', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### PUT /api/v1/keys/:platform/:id

    var options = {
        form: {
            data: {
                password: 'my-updated-password'
            }
        }
    };

    api.put('/keys/blackberry/1505', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### DELETE /api/v1/apps/:id

    api.del('/apps/14450', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### DELETE /api/v1/apps/:id/collaborators/:id

    api.del('/apps/232741/collaborators/263955', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### DELETE /api/v1/keys/:platform/:id

    api.del('/keys/ios/2729', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

## API

### client.auth(options, callback)

PhoneGap Build Authentication.

Authentications with PhoneGap Build and returns an instance of `API`.
The authentication credentials can be a username and password or user-token.

#### Options:

  - `options` `{Object}` is the authentication settings.
  - `options.username` `{String}` is the phonegap build username.
  - `options.password` `{String}` is the phonegap build password.
  - `options.token` `{String}` can be used instead of username and password.
  - [`options.protocol`] `{String}` optional server protocol. e.g. 'https:'.
  - [`options.host`] `{String}` optional server host. e.g. 'build.phonegap.com:'.
  - [`options.port`] `{String}` optional server port. e.g. '443'.
  - [`options.path`] `{String}` optional server path prefix. e.g. '/api/v1'.
  - [`options.proxy`] `{String}` specifies an optional proxy server. e.g. 'http://myproxy.com:8181'.
  - `callback` `{Function}` is trigger after the authentication.
    - `e` `{Error}` is null unless there is an error.
    - `api` `{Object}` is the `API` instance to interact with phonegap build.

#### Example:

    var client = require('phonegap-build-api');

    client.auth({ username: 'zelda', password: 'tr1force' }, function(e, api) {
        if (e) {
            console.log('error:', e);
            return;
        }

        // make some api requests
    });

### api(path, [options], [callback])

API Request.

Create a RESTful request to the PhoneGap Build API. The `api` function is a
wrapper to [request][github-request]'s interface.

The `path` parameter is a relative path to a PhoneGap Build API response.
For example, to the resource `https://build.phonegap.com/api/v1/me` is specified
as the path `/me`.

The `options` parameter maps directly to [request][github-request]'s options.

The default request method is `GET`. You can specify a specific but you can be changed
in the `options` parameters (e.g. `{ method: 'POST' }`).

To send form data, you can use the `options.form` parameter. The key `data` is
assumed to be JSON and all other keys are assumed to be file paths.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/apps"`).
  - `[options]` `{Object}` is a request options object.
  - `[options.protocol]` `{String}` optional server protocol. e.g. 'https:'.
  - `[options.host]` `{String}` optional server host. e.g. 'build.phonegap.com:'.
  - `[options.port]` `{String}` optional server port. e.g. '443'.
  - `[options.path]` `{String}` optional server path prefix. e.g. '/api/v1'.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example: GET Request

    api('/me', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

#### Example: POST Request

    var options = {
        form: {
            data: {
                title: 'My App',
                create_method: 'file'
            },
            file: '/path/to/app.zip'
        },
        method: 'POST'
    };

    api('/apps', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.get(path, [options], [callback])

GET API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'GET' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/apps"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    api.get('/me', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.post(path, [options], [callback])

POST API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'POST' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/apps"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    var options = {
        form: {
            data: {
                title: 'My App',
                create_method: 'file'
            },
            file: '/path/to/app.zip'
        }
    };

    api.post('/apps', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.put(path, [options], [callback])

PUT API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'PUT' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/apps"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    var options = {
        form: {
            data: {
                debug: false
            },
            file: '/path/to/app.zip'
        }
    };

    api.put('/apps/197196', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.del(path, [options], [callback])

DELETE API Request.

A convenience function for `api(path, [options], [callback])`, where `options`
uses `{ method: 'DELETE' }`.

#### Options:

  - `path` `{String}` is a relative resource path (e.g. `"/apps"`).
  - `[options]` `{Object}` is a request options object.
  - `[callback]` `{Function}` is trigger after the request
    - `e` `{Error}` is null unless there is an error
    - `data` `{Object}` is the JSON response.

#### Example:

    api.del('/apps/14450', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });

### api.defaults(options)

This maps directly to [request][github-request]'s `default` method.

> This method returns a wrapper around the normal request API that defaults to whatever options you pass in to it.

## Alternative Libraries

### Java

- [pgbuild-api][pgbuild-api] by [Hardeep Shoker][github-hardeep]

### Node.js

- [phonegapbuildapi][github-phonegapbuildapi] by [germallon][github-germallon]

[travis-ci-img]: https://travis-ci.org/phonegap/node-phonegap-build-api.svg?branch=master
[travis-ci-url]: https://travis-ci.org/phonegap/node-phonegap-build-api
[build-api-docs]: https://build.phonegap.com/docs/api
[github-mikeal]: https://github.com/mikeal
[github-request]: https://github.com/mikeal/request
[pgbuild-api]: https://github.com/hardeep/pgbuild-api
[github-hardeep]: https://github.com/hardeep
[github-phonegapbuildapi]: https://github.com/germallon/phonegapbuildapi
[github-germallon]: https://github.com/germallon
[bithound-img]: https://www.bithound.io/github/phonegap/node-phonegap-build-api/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/node-phonegap-build-api
