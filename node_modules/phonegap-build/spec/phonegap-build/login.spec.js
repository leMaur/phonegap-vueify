/*
 * Module dependencies.
 */

var PhoneGapBuild = require('../../lib/phonegap-build'),
    config = require('../../lib/common/config'),
    client = require('phonegap-build-api'),
    phonegapbuild,
    options;

/*
 * Specification: phonegapbuild.login(options, [callback])
 */

describe('phonegapbuild.login(options, [callback])', function() {
    beforeEach(function() {
        phonegapbuild = new PhoneGapBuild();
        options = { username: 'zelda', password: 'tr1force' };
        spyOn(client, 'auth');
        spyOn(config.global, 'load');
        spyOn(config.global, 'save');
    });

    it('should require options', function() {
        expect(function() {
            options = null;
            phonegapbuild.login(options);
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegapbuild.login(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegapbuild.login(options)).toEqual(phonegapbuild);
    });

    it('should try to find auth token', function() {
        phonegapbuild.login(options, function(e, api) {});
        process.nextTick(function() {
            expect(config.global.load).toHaveBeenCalled();
        });
    });

    describe('successfully found auth token', function() {
        beforeEach(function() {
            config.global.load.andCallFake(function(callback) {
                callback(null, {
                    'phonegap': {
                        'token': 'abc123'
                    }
                });
            });
        });

        it('should trigger callback without an error', function(done) {
            phonegapbuild.login(options, function(e, api) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should trigger callback with an api object', function(done) {
            phonegapbuild.login(options, function(e, api) {
                expect(api).toBeDefined();
                done();
            });
        });

        describe('optional arguments', function() {
            it('should support options.protocol', function(done) {
                options.protocol = 'http:';
                phonegapbuild.login(options, function(e, api) {
                    expect(api.protocol).toEqual('http:');
                    done();
                });
            });

            it('should support options.host', function(done) {
                options.host = 'stage.build.phonegap.com';
                phonegapbuild.login(options, function(e, api) {
                    expect(api.host).toEqual('stage.build.phonegap.com');
                    done();
                });
            });

            it('should support options.port', function(done) {
                options.port = '1337';
                phonegapbuild.login(options, function(e, api) {
                    expect(api.port).toEqual('1337');
                    done();
                });
            });

            it('should support options.path', function(done) {
                options.path = '/api/v1';
                phonegapbuild.login(options, function(e, api) {
                    expect(api.path).toEqual('/api/v1');
                    done();
                });
            });

            it('should support options.proxy', function(done) {
                options.proxy = 'my.proxy.com';
                phonegapbuild.login(options, function(e, api) {
                    expect(api.proxy).toEqual('my.proxy.com');
                    done();
                });
            });
        });
    });

    describe('failed to find auth token', function() {
        beforeEach(function() {
            config.global.load.andCallFake(function(callback) {
                callback(new Error('config not found at ~/.cordova'));
            });
        });

        describe('when given username and password', function() {
            beforeEach(function() {
                options = {
                    username: 'zelda@nintendo.com',
                    password: 'tr1force'
                };
            });

            it('should try to authenticate', function() {
                phonegapbuild.login(options, function() {});
                expect(client.auth).toHaveBeenCalledWith(
                    options,
                    jasmine.any(Function)
                );
            });

            describe('successful authentication', function() {
                beforeEach(function() {
                    client.auth.andCallFake(function(options, callback) {
                        callback(null, { token: 'abc123' });
                    });
                });

                it('should try to save token', function(done) {
                    phonegapbuild.login(options, function(e, api) {});
                    process.nextTick(function() {
                        expect(config.global.save).toHaveBeenCalled();
                        expect(
                            config.global.save.mostRecentCall.args[0].phonegap.token
                        ).toEqual('abc123');
                        done();
                    });
                });

                describe('successfully saved token', function() {
                    beforeEach(function() {
                        config.global.save.andCallFake(function(data, callback) {
                            callback(null);
                        });
                    });

                    it('should trigger callback without an error', function(done) {
                        phonegapbuild.login(options, function(e, api) {
                            expect(e).toBeNull();
                            done();
                        });
                    });

                    it('should trigger callback with an api object', function(done) {
                        phonegapbuild.login(options, function(e, api) {
                            expect(api).toBeDefined();
                            done();
                        });
                    });
                });

                describe('failed to save token', function() {
                    beforeEach(function() {
                        config.global.save.andCallFake(function(data, callback) {
                            callback(new Error('No write permission'));
                        });
                    });

                    it('should trigger callback with an error', function(done) {
                        phonegapbuild.login(options, function(e, api) {
                            expect(e).toEqual(jasmine.any(Error));
                            done();
                        });
                    });

                    it('should trigger callback without an api object', function(done) {
                        phonegapbuild.login(options, function(e, api) {
                            expect(api).not.toBeDefined();
                            done();
                        });
                    });

                    it('should trigger "error" event', function(done) {
                        phonegapbuild.on('error', function(e) {
                            expect(e).toEqual(jasmine.any(Error));
                            done();
                        });
                        phonegapbuild.login(options);
                    });
                });
            });

            describe('failed authentication', function() {
                beforeEach(function() {
                    client.auth.andCallFake(function(options, callback) {
                        callback(new Error('account does not exist'));
                    });
                });

                it('should trigger callback an error', function(done) {
                    phonegapbuild.login(options, function(e, api) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger callback without an api object', function(done) {
                    phonegapbuild.login(options, function(e, api) {
                        expect(api).not.toBeDefined();
                        done();
                    });
                });

                it('should trigger "error" event', function(done) {
                    phonegapbuild.on('error', function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                    phonegapbuild.login(options);
                });
            });
        });

        describe('when missing username and/or password', function() {
            beforeEach(function() {
                options = {
                    username: 'zelda@nintendo.com'
                };
            });

            it('should fire a "login" event', function(done) {
                phonegapbuild.on('login', function(options, callback) {
                    expect(options).toEqual(options);
                    expect(callback).toEqual(jasmine.any(Function));
                    done();
                });
                phonegapbuild.login(options);
            });

            describe('successful "login" event callback', function() {
                it('should try to authenticate', function(done) {
                    phonegapbuild.on('login', function(options, callback) {
                        callback(null, { username: 'zelda', password: 'tr1force' });
                        expect(client.auth).toHaveBeenCalledWith(
                            { username: 'zelda', password: 'tr1force' },
                            jasmine.any(Function)
                        );
                        done();
                    });
                    phonegapbuild.login(options);
                });
            });

            describe('failed "login" event callback', function() {
                beforeEach(function() {
                    phonegapbuild.on('login', function(options, callback) {
                        callback(new Error('Ganon stole my username'));
                    });
                });

                it('should not try to authenticate', function(done) {
                    phonegapbuild.login(options);
                    process.nextTick(function() {
                        expect(client.auth).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should trigger callback with an error', function(done) {
                    phonegapbuild.login(options, function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });
            });
        });
    });

    describe('failed to read config', function() {
        beforeEach(function() {
            config.global.load.andCallFake(function(callback) {
                callback(new Error('cannot read config file'));
            });
        });

        it('should try to authenticate', function() {
            phonegapbuild.login(options);
            expect(client.auth).toHaveBeenCalled();
        });
    });
});
