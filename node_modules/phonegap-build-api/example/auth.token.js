/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * Authentication with token.
 */

var options = {
    token: 'abc123'
};

client.auth(options, function(e, api) {
    console.log('error:', e);
    console.log('api:', api);
});
