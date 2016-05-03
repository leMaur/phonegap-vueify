/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * DELETE https://build.phonegap.com/api/v1/keys/:platform/:id
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    api.del('/keys/ios/2729', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
