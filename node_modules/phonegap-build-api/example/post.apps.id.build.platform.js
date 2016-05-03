/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * POST https://build.phonegap.com/api/v1/apps/:id/build/:platform
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    api.post('/apps/232741/build/android', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
