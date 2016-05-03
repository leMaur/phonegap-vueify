var phonegap = require('../lib'),
    path = require('path');

phonegap.create({
    path: path.join(__dirname, 'basic-app'),
    version: '3.3.0'
})
.on('progress', function(state) {
    console.log('progress:', state);
})
.on('error', function(e) {
    console.error('error:', e);
})
.on('complete', function(data) {
    console.log('complete:', data);
});