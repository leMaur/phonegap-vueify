var request = require('request');

module.exports = {
    send: function(uri, options, callback) {
        return request(uri, options, callback);
    },
    defaults: request.defaults
};
