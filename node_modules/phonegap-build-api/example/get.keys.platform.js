/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * GET https://build.phonegap.com/api/v1/keys/:platform
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    api.get('/keys/ios', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
