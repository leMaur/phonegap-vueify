var defaults = require('../lib/defaults');

describe('defaults', function() {
        it('should set username to undefined', function() {
            expect(defaults.username).toBeUndefined();
        });

        it('should set password to undefined', function() {
            expect(defaults.password).toBeUndefined();
        });

        it('should set protocol to "https:"', function() {
            expect(defaults.protocol).toEqual('https:');
        });

        it('should set host     to "build.phonegap.com"', function() {
            expect(defaults.host).toEqual('build.phonegap.com');
        });

        it('should set port     to "443"', function() {
            expect(defaults.port).toEqual('443');
        });

        it('should set path     to "/api/v1"', function() {
            expect(defaults.path).toEqual('/api/v1');
        });
});
