/*
 * Module dependencies.
 */

var PhoneGapBuild = require('../../lib/phonegap-build'),
    config = require('../../lib/common/config'),
    phonegapbuild;

/*
 * Specification for logout.
 */

describe('logout(options, callback)', function() {
    beforeEach(function() {
        phonegapbuild = new PhoneGapBuild();
        spyOn(config.global, 'load');
        spyOn(config.global, 'save');
    });

    it('should require options parameter', function() {
        expect(function() {
            phonegapbuild.logout(undefined, function(e) {});
        }).toThrow();
    });

    it('should not require callback parameter', function() {
        expect(function() {
            phonegapbuild.logout({}, undefined);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegapbuild.logout({})).toEqual(phonegapbuild);
    });

    it('should try to load the config', function(done) {
        phonegapbuild.logout({}, function(e) {});
        process.nextTick(function() {
            expect(config.global.load).toHaveBeenCalled();
            done();
        });
    });

    describe('successfully load config', function() {
        beforeEach(function() {
            config.global.load.andCallFake(function(callback) {
                callback(null, {
                    phonegap: {
                        email: 'zelda@nintendo.com',
                        token: 'abc123'
                    }
                });
            });
        });

        it('should try to save the config', function(done) {
            phonegapbuild.logout({}, function(e) {});
            process.nextTick(function() {
                expect(config.global.save).toHaveBeenCalled();
                done();
            });
        });

        describe('successfully saved config', function() {
            beforeEach(function() {
                config.global.save.andCallFake(function(data, callback) {
                    callback(null);
                });
            });

            it('should delete the token key', function(done) {
                phonegapbuild.logout({}, function(e) {});
                process.nextTick(function() {
                    expect(config.global.save.mostRecentCall.args[0].phonegap.token).not.toBeDefined();
                    done();
                });
            });

            it('should preserve the remaining keys', function(done) {
                phonegapbuild.logout({}, function(e) {});
                process.nextTick(function() {
                    expect(config.global.save.mostRecentCall.args[0]).toEqual(
                        {
                            phonegap: {
                                email: 'zelda@nintendo.com'
                            }
                        }
                    );
                    done();
                });
            });

            it('should trigger callback without an error', function(done) {
                phonegapbuild.logout({}, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed to save config', function() {
            beforeEach(function() {
                config.global.save.andCallFake(function(data, callback) {
                    callback(new Error('no write access'));
                });
            });

            it('should trigger callback with an error', function(done) {
                phonegapbuild.logout({}, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });

            it('should trigger "error" event', function(done) {
                phonegapbuild.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
                phonegapbuild.logout({});
            });
        });
    });

    describe('failed to load config', function() {
        beforeEach(function() {
            config.global.load.andCallFake(function(callback) {
                callback(new Error('no read access'));
            });
        });

        it('should trigger callback with an error', function(done) {
            phonegapbuild.logout({}, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegapbuild.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegapbuild.logout({});
        });
    });
});
