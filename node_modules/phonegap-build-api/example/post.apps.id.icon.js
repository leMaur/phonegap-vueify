/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * POST https://build.phonegap.com/api/v1/apps/:id/icon
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    var options = {
        form: {
            icon: 'icon-64.png'
        }
    };

    api.post('/apps/232741/icon', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
