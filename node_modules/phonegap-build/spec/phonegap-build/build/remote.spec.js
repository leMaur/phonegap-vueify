/*
 * Module dependencies.
 */

var build = require('../../../lib/phonegap-build/build/remote'),
    config = require('../../../lib/common/config'),
    zip = require('../../../lib/phonegap-build/create/zip'),
    path = require('path'),
    appData,
    options;

/*
 * Specification for remote build.
 */

describe('build(options, callback)', function() {
    beforeEach(function() {
        options = {
            api: {
                put: function() {
                    // spy stub
                }
            },
            emitter: {
                emit: function() {
                    // spy stub
                }
            },
            platforms: ['android']
        };
        appData = {
            id: '1234',
            title: 'My App',
            download: {
                android: '/api/v1/apps/322388/android'
            }
        };
        spyOn(zip, 'compress');
        spyOn(zip, 'cleanup');
        spyOn(options.api, 'put');
        spyOn(config.local, 'load');
        spyOn(build, 'waitForComplete');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            build(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.api', function() {
        expect(function() {
            options.api = undefined;
            build(options, function(e, data) {});
        }).toThrow();
    });

    it('should require parameter options.emitter', function() {
        expect(function() {
            options.emitter = undefined;
            create(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            build(options, function(e, data) {});
        }).toThrow();
    });

    it('should require callback', function() {
        expect(function() {
            build(options);
        }).toThrow();
    });

    it('should try to zip application', function() {
        build(options, function(e, data) {});
        expect(zip.compress).toHaveBeenCalledWith(
            path.join(process.cwd(), 'www'),   // path to zip
            path.join(process.cwd(), 'build'), // path to write zip file
            jasmine.any(Function)
        );
    });

    describe('successful zip', function() {
        beforeEach(function() {
            zip.compress.andCallFake(function(wwwPath, buildPath, callback) {
                callback(null, '/path/to/build/www.zip');
            });

            config.local.load.andCallFake(function(callback) {
                callback(null, {
                    'phonegap': {
                        'id': 12345
                    }
                });
            });
        });

        it('should try to upload app to phonegap build', function() {
            build(options, function(e, data) {});
            expect(options.api.put).toHaveBeenCalledWith(
                '/apps/12345',
                { form: { file: '/path/to/build/www.zip' } },
                jasmine.any(Function)
            );
        });

        describe('successful upload', function() {
            beforeEach(function() {
                options.api.put.andCallFake(function(path, headers, callback) {
                    callback(null, {});
                });
            });

            it('should delete zip archive', function() {
                build(options, function(e, data) {});
                expect(zip.cleanup).toHaveBeenCalled();
            });

            it('should wait for the platform build to complete', function() {
                build(options, function(e, data) {});
                expect(build.waitForComplete).toHaveBeenCalled();
            });

            describe('on build complete', function() {
                beforeEach(function() {
                    build.waitForComplete.andCallFake(function(options, callback) {
                        callback(null, appData);
                    });
                });

                it('should trigger callback without an error', function(done) {
                    build(options, function(e, data) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with app data', function(done) {
                    build(options, function(e, data) {
                        expect(data).toEqual(appData);
                        done();
                    });
                });
            });

            describe('on build error', function() {
                beforeEach(function() {
                    build.waitForComplete.andCallFake(function(options, callback) {
                        callback(new Error('server did not respond'));
                    });
                });

                it('should trigger callback without an error', function(done) {
                    build(options, function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });
            });
        });

        describe('failed upload', function() {
            beforeEach(function() {
                options.api.put.andCallFake(function(path, headers, callback) {
                    callback(new Error('Server did not respond'));
                });
            });

            it('should delete zip archive', function() {
                build(options, function(e) {});
                expect(zip.cleanup).toHaveBeenCalled();
            });

            it('should trigger callback with an error', function(done) {
                build(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});

/*
 * Specification for build.waitForComplete(options, callback);
 */

describe('build.waitForComplete', function() {
    beforeEach(function() {
        options = {
            api: {
                get: function() {
                    // spy stub
                }
            },
            id: 12345,
            platforms: ['android']
        };
        appData = {
            id: '1234',
            title: 'My App',
            download: {
                android: '/api/v1/apps/322388/android'
            }
        };
        spyOn(options.api, 'get');
    });

    it('should require options parameter', function() {
        expect(function() {
            options = undefined;
            build.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.api parameter', function() {
        expect(function() {
            options.api = undefined;
            build.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.id parameter', function() {
        expect(function() {
            options.id = undefined;
            build.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.platforms parameter', function() {
        expect(function() {
            options.platforms = undefined;
            build.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.platforms parameter', function() {
        expect(function() {
            build.waitForComplete(options);
        }).toThrow();
    });

    it('should try to get application status', function() {
        build.waitForComplete(options, function(e, data) {});
        expect(options.api.get).toHaveBeenCalled();
    });
});
