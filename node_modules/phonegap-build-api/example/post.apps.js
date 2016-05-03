/*!
 * Module dependencies.
 */
var client = require('../lib/client');

/*!
 * POST https://build.phonegap.com/api/v1/apps
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    var options = {
        form: {
            data: {
                title: 'My App',
                create_method: 'file',
                debug: false
            },
            file: '/Users/zelda/dev/app/phonegap-start/app.zip'
        }
    };

    api.post('/apps', options, function(e, data) {
        console.log('error:', e);
        console.log('data:', data);
    });
});
