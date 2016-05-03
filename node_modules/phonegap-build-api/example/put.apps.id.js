/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * PUT https://build.phonegap.com/api/v1/apps/:id
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

// update debug setting

client.auth(options, function(e, api) {
    var options = {
        form: {
            data: {
                'debug': true
            }
        }
    };

    api.put('/apps/197196', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});

// upload a new app

//client.auth(options, function(e, api) {
//    var options = {
//        form: {
//            file: '/Users/zelda/dev/app/phonegap-start/app.zip'
//        }
//    };

//    api.put('/apps/274937', options, function(e, data) {
//        console.log('error:', e);
//        console.log('data:', data);
//    });
//});
