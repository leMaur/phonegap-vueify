/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * PUT https://build.phonegap.com/api/v1/keys/:platform/:id
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    var options = {
        form: {
            data: {
                password: 'MyNewPassword'
            }
        }
    };

    api.put('/keys/blackberry/1505', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
