/*
 * Module dependencies.
 */

var create = require('../../../lib/phonegap-build/create/remote'),
    config = require('../../../lib/common/config'),
    zip = require('../../../lib/phonegap-build/create/zip'),
    shell = require('shelljs'),
    path = require('path'),
    fs = require('fs'),
    appData,
    options;

/*
 * Remote create specification.
 */

describe('create.remote(options, callback)', function() {
    beforeEach(function() {
        options = {
            name: 'My App',
            path: 'path/to/app.zip',
            emitter: {
                emit: function() {
                    // spy stub
                }
            },
            api: {
                post: function() {
                    // spy stub
                }
            }
        };
        appData = {
            id: '1234',
            title: 'My App',
            download: {
                android: '/api/v1/apps/322388/android'
            }
        };
        spyOn(options.api, 'post');
        spyOn(zip, 'compress');
        spyOn(zip, 'cleanup');
        spyOn(config.local, 'load');
        spyOn(config.local, 'save');
        spyOn(create, 'waitForComplete');
        spyOn(process, 'chdir');
        spyOn(fs, 'readFile');
    });

    it('should require parameter options', function() {
        expect(function() {
            options = undefined;
            create(options, function(e, data) {});
        }).toThrow();
    });

    it('should require parameter options.api', function() {
        expect(function() {
            options.api = undefined;
            create(options, function(e, data) {});
        }).toThrow();
    });

    it('should require parameter options.emitter', function() {
        expect(function() {
            options.emitter = undefined;
            create(options, function(e, data) {});
        }).toThrow();
    });

    it('should require parameter callback', function() {
        expect(function() {
            create(options);
        }).toThrow();
    });

    describe('when reading config', function() {
        it('should try to open my-app/www/config.xml', function() {
            create(options, function(e, data) {});
            expect(fs.readFile).toHaveBeenCalled();
            expect(fs.readFile.mostRecentCall.args[0]).toMatch('www/config.xml');
        });

        it('should fallback to my-app/config.xml', function() {
            spyOn(fs, 'existsSync').andReturn(true);
            create(options, function(e, data) {});
            expect(fs.readFile).toHaveBeenCalled();
            expect(fs.readFile.mostRecentCall.args[0]).not.toMatch('www/config.xml');
            expect(fs.readFile.mostRecentCall.args[0]).toMatch('/config.xml');
        });

        it('should try to read app name', function() {
            create(options, function(e, data) {});
            expect(fs.readFile).toHaveBeenCalled();
            expect(fs.readFile.mostRecentCall.args[0]).toMatch(/config\.xml$/);
        });
    });

    describe('successfully read app name', function() {
        beforeEach(function() {
            fs.readFile.andCallFake(function(path, encoding, callback) {
                callback(null, '<widget><name>My App</name></widget>');
            });
        });

        it('should try to zip application', function() {
            create(options, function(e, data) {});
            expect(zip.compress).toHaveBeenCalledWith(
                path.join(process.cwd(), 'www'),
                path.join(process.cwd(), 'build'),
                jasmine.any(Function)
            );
        });

        describe('successful zip', function() {
            beforeEach(function() {
                zip.compress.andCallFake(function(wwwPath, buildPath, callback) {
                    callback(null, '/path/to/build/www.zip');
                });
            });

            it('should try to make a post request', function() {
                create(options, function(e, data) {});
                expect(options.api.post).toHaveBeenCalledWith(
                    jasmine.any(String),
                    jasmine.any(Object),
                    jasmine.any(Function)
                );
            });

            describe('successful post request', function() {
                beforeEach(function() {
                    options.api.post.andCallFake(function(path, headers, callback) {
                        callback(null, { id: '10' });
                    });
                });

                it('should delete zip archive', function() {
                    create(options, function(e, data) {});
                    expect(zip.cleanup).toHaveBeenCalled();
                });

                it('should try to load config.json', function() {
                    create(options, function(e, data) {});
                    expect(config.local.load).toHaveBeenCalled();
                });

                describe('successful load config.json', function() {
                    beforeEach(function() {
                        config.local.load.andCallFake(function(callback) {
                            callback(null, {});
                        });
                    });

                    it('should try to save config.json', function() {
                        create(options, function(e, data) {});
                        expect(config.local.save).toHaveBeenCalled();
                    });

                    describe('successful save config.json', function() {
                        beforeEach(function() {
                            config.local.save.andCallFake(function(data, callback) {
                                callback(null);
                            });
                        });

                        it('should wait for the platform build to complete', function() {
                            create(options, function(e, data) {});
                            expect(create.waitForComplete).toHaveBeenCalled();
                        });

                        describe('on build complete', function() {
                            beforeEach(function() {
                                create.waitForComplete.andCallFake(function(options, callback) {
                                    callback(null, appData);
                                });
                            });

                            it('should trigger callback without an error', function(done) {
                                create(options, function(e, data) {
                                    expect(e).toBeNull();
                                    done();
                                });
                            });

                            it('should trigger callback with app data', function() {
                                create(options, function(e, data) {
                                    expect(data).toEqual(appData);
                                });
                            });
                        });

                        describe('on build error', function() {
                            beforeEach(function() {
                                create.waitForComplete.andCallFake(function(options, callback) {
                                    callback(new Error('server did not respond'));
                                });
                            });

                            it('should trigger callback without an error', function(done) {
                                create(options, function(e, data) {
                                    expect(e).toEqual(jasmine.any(Error));
                                    done();
                                });
                            });
                        });
                    });

                    describe('failed save config.json', function() {
                        beforeEach(function() {
                            config.local.save.andCallFake(function(data, callback) {
                                callback(new Error('could not write config.json'));
                            });
                        });

                        it('should trigger callback with an error', function(done) {
                            create(options, function(e, data) {
                                expect(e).toEqual(jasmine.any(Error));
                                done();
                            });
                        });
                    });
                });

                describe('failed to load config.json', function() {
                    beforeEach(function() {
                        config.local.load.andCallFake(function(callback) {
                            callback(new Error('could not read config.json'));
                        });
                    });

                    it('should not call config.save', function() {
                        create(options, function(e, data) {});
                        expect(config.local.save).not.toHaveBeenCalled();
                    });

                    it('should trigger callback with an error', function(done) {
                        create(options, function(e, data) {
                            expect(e).toEqual(jasmine.any(Error));
                            done();
                        });
                    });
                });
            });

            describe('failed post request', function() {
                beforeEach(function() {
                    options.api.post.andCallFake(function(path, headers, callback) {
                        callback(new Error('PhoneGap Build did not respond'));
                    });
                });

                it('should delete zip archive', function() {
                    create(options, function(e, data) {});
                    expect(zip.cleanup).toHaveBeenCalled();
                });

                it('should trigger callback with an error', function(done) {
                    create(options, function(e, data) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });
            });
        });

        describe('failed zip', function() {
            beforeEach(function() {
                zip.compress.andCallFake(function(wwwPath, buildPath, callback) {
                    callback(new Error('Write access denied'));
                });
            });

            it('should not make a post request', function() {
                create(options, function(e, data) {});
                expect(options.api.post).not.toHaveBeenCalled();
            });

            it('should trigger callback with an error', function(done) {
                create(options, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('failure reading app name', function() {
        describe('missing config.xml', function() {
            beforeEach(function() {
                fs.readFile.andCallFake(function(path, encoding, callback) {
                    callback(new Error('could not open file'));
                });
            });

            it('should trigger callback with an error', function(done) {
                create(options, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });

        describe('missing <name> element', function() {
            beforeEach(function() {
                fs.readFile.andCallFake(function(path, encoding, callback) {
                    callback(null, '<widget></widget>');
                });
            });

            it('should trigger callback with an error', function(done) {
                create(options, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});

/*
 * Specification for create.waitForComplete(options, callback);
 */

describe('create.waitForComplete', function() {
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
            create.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.api parameter', function() {
        expect(function() {
            options.api = undefined;
            create.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.id parameter', function() {
        expect(function() {
            options.id = undefined;
            create.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.platforms parameter', function() {
        expect(function() {
            options.platforms = undefined;
            create.waitForComplete(options, function(e, data) {});
        }).toThrow();
    });

    it('should require options.platforms parameter', function() {
        expect(function() {
            create.waitForComplete(options);
        }).toThrow();
    });

    it('should try to get application status', function() {
        create.waitForComplete(options, function(e, data) {});
        expect(options.api.get).toHaveBeenCalled();
    });
});
