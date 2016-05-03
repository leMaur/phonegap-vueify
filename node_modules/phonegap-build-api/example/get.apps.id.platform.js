/*!
 * Module dependencies.
 */

var client = require('../lib/client'),
    fs = require('fs');

/*!
 * GET https://build.phonegap.com/api/v1/apps/:id/:platform
 */

var options = {
    username: 'zelda@nintendo.com',
    password: 'tr1force'
};

client.auth(options, function(e, api) {
    api.get('/apps/199692/android').pipe(fs.createWriteStream('android.apk'));
});
