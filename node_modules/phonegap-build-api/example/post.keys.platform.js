/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * POST https://build.phonegap.com/api/v1/keys/:platform
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    var options = {
        form: {
            data: {
                title: 'My BlackBerry Keys',
                password: 'SuperSafePassword'
            },
            db: '/Users/zelda/keys/sigtool.db',
            csk: '/Users/zelda/keys/sigtool.csk'
        }
    };

    api.post('/keys/blackberry', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
