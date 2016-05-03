/*!
 * Module dependencies.
 */

var PhoneGapBuild = require('../lib/phonegap-build'),
    phonegapbuild;

/*!
 * PhoneGapBuild specification.
 */

describe('phonegapbuild', function() {
    beforeEach(function() {
        phonegapbuild = new PhoneGapBuild();
    });

    it('should have a login action', function() {
        expect(phonegapbuild.login).toEqual(jasmine.any(Function));
    });

    it('should have a logout action', function() {
        expect(phonegapbuild.logout).toEqual(jasmine.any(Function));
    });

    it('should have a create action', function() {
        expect(phonegapbuild.create).toEqual(jasmine.any(Function));
    });

    it('should have a build action', function() {
        expect(phonegapbuild.build).toEqual(jasmine.any(Function));
    });

    it('should support global events', function(done) {
        phonegapbuild.on('log', function() {
            done();
        });
        phonegapbuild.emit('log', 'hello world');
    });

    it('should not throw "error" events', function(done) {
        phonegapbuild.on('error', function() {
            done();
        });
        expect(function() {
            phonegapbuild.emit('error', new Error('hello world'));
        }).not.toThrow();
    });
});
