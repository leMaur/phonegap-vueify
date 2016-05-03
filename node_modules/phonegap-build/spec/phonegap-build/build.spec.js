/*
 * Module dependencies.
 */

var PhoneGapBuild = require('../../lib/phonegap-build'),
    config = require('../../lib/common/config'),
    phonegapbuild,
    appData,
    options;

/*
 * Specification: phonegapbuild.build(options, [callback])
 */

describe('phonegapbuild.build(options, [callback])', function() {
    beforeEach(function() {
        phonegapbuild = new PhoneGapBuild();
        options = {
            platforms: ['android']
        };
        appData = {
            id: '1234',
            title: 'My App',
            download: {
                android: '/api/v1/apps/322388/android'
            }
        };
        spyOn(phonegapbuild, 'login');
        spyOn(phonegapbuild.build, 'create');
        spyOn(phonegapbuild.build, 'build');
        spyOn(config.local, 'load');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegapbuild.build(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegapbuild.build(options, function(e, data) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegapbuild.build(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegapbuild.build(options)).toEqual(phonegapbuild);
    });

    it('should try to login', function() {
        phonegapbuild.build(options);
        expect(phonegapbuild.login).toHaveBeenCalled();
    });

    describe('optional arguments', function() {
        it('should support options.protocol', function() {
            options.protocol = 'http:';
            phonegapbuild.build(options);
            expect(
                phonegapbuild.login.mostRecentCall.args[0].protocol
            ).toEqual('http:');
        });

        it('should support options.host', function() {
            options.host = 'stage.build.phonegap.com';
            phonegapbuild.build(options);
            expect(
                phonegapbuild.login.mostRecentCall.args[0].host
            ).toEqual('stage.build.phonegap.com');
        });

        it('should support options.port', function() {
            options.port = '1337';
            phonegapbuild.build(options);
            expect(
                phonegapbuild.login.mostRecentCall.args[0].port
            ).toEqual('1337');
        });

        it('should support options.path', function() {
            options.path = '/api/v1';
            phonegapbuild.build(options);
            expect(
                phonegapbuild.login.mostRecentCall.args[0].path
            ).toEqual('/api/v1');
        });

        it('should support options.proxy', function() {
            options.proxy = 'my.proxy.com';
            phonegapbuild.build(options);
            expect(
                phonegapbuild.login.mostRecentCall.args[0].proxy
            ).toEqual('my.proxy.com');
        });
    });

    describe('when login is successful', function() {
        beforeEach(function() {
            phonegapbuild.login.andCallFake(function(options, callback) {
                callback(null, { /* api */ });
            });
        });

        describe('when app exists', function() {
            beforeEach(function() {
                config.local.load.andCallFake(function(callback) {
                    callback(null, { 'phonegap': { 'id': 12345 } });
                });
            });

            it('should try to build the app', function(done) {
                phonegapbuild.build(options);
                process.nextTick(function() {
                    expect(phonegapbuild.build.build).toHaveBeenCalledWith(
                        {
                            api: jasmine.any(Object),
                            emitter: jasmine.any(Object),
                            platforms: jasmine.any(Array)
                        },
                        jasmine.any(Function)
                    );
                    done();
                });
            });

            describe('when build successful', function() {
                beforeEach(function() {
                    phonegapbuild.build.build.andCallFake(function(options, callback) {
                        callback(null, appData);
                    });
                });

                it('should trigger callback without an error', function(done) {
                    phonegapbuild.build(options, function(e, data) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with data', function(done) {
                    phonegapbuild.build(options, function(e, data) {
                        expect(data).toEqual(appData);
                        done();
                    });
                });
            });

            describe('when build failed', function() {
                beforeEach(function() {
                    phonegapbuild.build.build.andCallFake(function(options, callback) {
                        callback(new Error('server did not respond'));
                    });
                });

                it('should trigger callback with an error', function(done) {
                    phonegapbuild.build(options, function(e, data) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger "error" event', function(done) {
                    phonegapbuild.on('error', function(e, data) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                    phonegapbuild.build(options);
                });
            });
        });

        describe('when app does not exist', function() {
            beforeEach(function() {
                config.local.load.andCallFake(function(callback) {
                    callback(null, {});
                });
            });

            it('should try to create the app', function(done) {
                phonegapbuild.build(options);
                process.nextTick(function() {
                    expect(phonegapbuild.build.create).toHaveBeenCalled();
                    done();
                });
            });

            describe('when create succuessful', function() {
                beforeEach(function() {
                    phonegapbuild.build.create.andCallFake(function(options, callback) {
                        callback(null, appData);
                    });
                });

                it('should trigger callback without an error', function(done) {
                    phonegapbuild.build(options, function(e, data) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with data', function(done) {
                    phonegapbuild.build(options, function(e, data) {
                        expect(data).toEqual(appData);
                        done();
                    });
                });
            });

            describe('when create fails', function() {
                beforeEach(function() {
                    phonegapbuild.build.create.andCallFake(function(options, callback) {
                        callback(new Error('server did not respond'));
                    });
                });

                it('should trigger callback with an error', function(done) {
                    phonegapbuild.build(options, function(e, data) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger "error" event', function(done) {
                    phonegapbuild.on('error', function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                    phonegapbuild.build(options);
                });
            });
        });
    });

    describe('when login is failure', function() {
        beforeEach(function() {
            phonegapbuild.login.andCallFake(function(options, callback) {
                var e = new Error('incorrect username or password');
                phonegapbuild.emit('error', e);
                callback(e);
            });
        });

        it('should trigger callback with error', function(done) {
            phonegapbuild.build(options, function(e, data) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegapbuild.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegapbuild.build(options);
        });
    });
});
