/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * GET https://build.phonegap.com/api/v1/apps/:id
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    api.get('/apps/199692', function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
