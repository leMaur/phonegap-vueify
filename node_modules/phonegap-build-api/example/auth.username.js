/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * Authentication with username and password.
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    console.log('error:', e);
    console.log('api:', api);
});
