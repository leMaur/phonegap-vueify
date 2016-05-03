/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * DELETE https://build.phonegap.com/api/v1/apps/:id
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    api.del('/apps/14450', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
