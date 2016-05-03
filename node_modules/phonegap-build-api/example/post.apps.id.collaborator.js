/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * POST https://build.phonegap.com/api/v1/apps/:id/collaborators
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    var options = {
        form: {
            data: {
                email: 'link@nintendo.com',
                role: 'dev'
            }
        }
    };

    api.post('/apps/232741/collaborators', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
