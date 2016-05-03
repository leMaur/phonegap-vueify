module.exports = {
    uri: function(options) {
        return options.host + ':' + options.port + '/' + options.path.replace(/[\/\s]/g, '');
    },
    fn: function(fn) {
        return fn || function() {};
    }
};
