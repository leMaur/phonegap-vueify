/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * POST https://build.phonegap.com/api/v1/apps/:id/build
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

// build all platforms

client.auth(options, function(e, api) {
    api.post('/apps/232741/build', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});

// or specify a plaform

//client.auth(options, function(e, api) {
//    var options = {
//        form: {
//            data: {
//                platforms: [ 'android', 'winphone', 'webos' ]
//            }
//        }
//    };

//    api.post('/apps/232741/build', options, function(e, data) {
//        console.log('error:', e);
//        console.log('data:', data);
//    });
//});
