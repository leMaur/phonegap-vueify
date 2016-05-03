/*
 * Module dependencies.
 */

var PhoneGapBuild = require('../../lib/phonegap-build'),
    config = require('../../lib/common/config'),
    zip = require('../../lib/phonegap-build/create/zip'),
    shell = require('shelljs'),
    path = require('path'),
    fs = require('fs'),
    phonegapbuild,
    options;

/*
 * Create specification.
 */

describe('create(options, callback)', function() {
    beforeEach(function() {
        phonegapbuild = new PhoneGapBuild();
        options = {
            api: {},
            path: '/some/path/to/app/www'
        };
        spyOn(phonegapbuild.create, 'local');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegapbuild.create(options, function(e) {});
        }).toThrow();
    });

    it('should require options.path', function() {
        expect(function() {
            options.path = undefined;
            phonegapbuild.create(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegapbuild.create(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegapbuild.create(options)).toEqual(phonegapbuild);
    });

    it('should try to create local project', function(done) {
        phonegapbuild.create(options, function(e) {});
        process.nextTick(function() {
            expect(phonegapbuild.create.local).toHaveBeenCalledWith(
                { path: options.path },
                jasmine.any(Function)
            );
            done();
        });
    });

    describe('successfully created local project', function() {
        beforeEach(function() {
            phonegapbuild.create.local.andCallFake(function(options, callback) {
                callback(null);
            });
        });

        it('should trigger called without an error', function(done) {
            phonegapbuild.create(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('failed to create local project', function() {
        beforeEach(function() {
            phonegapbuild.create.local.andCallFake(function(options, callback) {
                callback(new Error('app path already exists'));
            });
        });

        it('should trigger callback with an error', function(done) {
            phonegapbuild.create(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegapbuild.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegapbuild.create(options);
        });
    });
});

/*
 * Local create specification.
 */

describe('phonegapbuild.create.local(options, [callback])', function() {
    beforeEach(function() {
        options = { path: '/some/path/to/my/app' };
        spyOn(fs, 'exists');
        spyOn(shell, 'cp');
        spyOn(shell, 'mkdir');
        spyOn(shell, 'mv');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegapbuild.create.local(options, function(e) {});
        }).toThrow();
    });

    it('should require options.path', function() {
        expect(function() {
            options.path = undefined;
            phonegapbuild.create.local(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegapbuild.create.local(options);
        }).not.toThrow();
    });

    it('should check if path exists', function() {
        phonegapbuild.create.local(options, function(e) {});
        expect(fs.exists).toHaveBeenCalledWith(options.path, jasmine.any(Function));
    });

    describe('path is available', function() {
        beforeEach(function() {
            fs.exists.andCallFake(function(path, callback) {
                callback(false);
            });
        });

        it('should create project from path', function() {
            phonegapbuild.create.local(options, function(e) {});
            expect(shell.cp).toHaveBeenCalled();
            expect(shell.cp.mostRecentCall.args[0]).toEqual('-R');
        });

        describe('successful create', function() {
            beforeEach(function() {
                spyOn(shell, 'error').andReturn(null);
            });

            it('should trigger callback without an error', function(done) {
                phonegapbuild.create.local(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed create', function() {
            beforeEach(function() {
                spyOn(shell, 'error').andReturn('no write access to path');
            });

            it('should not throw an error', function() {
                expect(function() {
                    phonegapbuild.create.local(options, function(e) {});
                }).not.toThrow();
            });

            it('should trigger callback with an error', function(done) {
                phonegapbuild.create.local(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('path is not available', function() {
        beforeEach(function() {
            fs.exists.andCallFake(function(path, callback) {
                callback(true);
            });
        });

        it('should trigger callback with an error', function(done) {
            phonegapbuild.create.local(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });
    });
});
