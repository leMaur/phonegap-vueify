/*
 * Module dependencies.
 */

var zip = require('../../lib/phonegap-build/create/zip'),
    shell = require('shelljs'),
    fs = require('fs'),
    os = require('os'),
    p = require('path');

/*
 * Zip specification.
 */

describe('zip', function() {

    /*
     * zip.compress(path, callback);
     */

    describe('compress(path, callback)', function() {
        beforeEach(function() {
            spyOn(fs, 'exists');
            spyOn(fs, 'existsSync');
            spyOn(zip, 'cleanup');
            spyOn(shell, 'mkdir');
            spyOn(shell, 'cp');
            spyOn(shell, 'exec').andReturn({ code: 0 });
            spyOn(shell, 'rm');
            spyOn(shell, 'cd');
        });

        it('should require a wwwPath parameter', function() {
            expect(function() {
                zip.compress();
            }).toThrow();
        });

        it('should require a buildPath parameter', function() {
            expect(function() {
                zip.compress('./www');
            }).toThrow();
        });

        it('should require a callback parameter', function() {
            expect(function() {
                zip.compress('./www', './build');
            }).toThrow();
        });

        it('should check if path exists', function() {
            zip.compress('./www', './build', function(e, path) {});
            expect(fs.exists).toHaveBeenCalled();
        });

        describe('path exists', function() {
            beforeEach(function() {
                fs.exists.andCallFake(function(path, callback) {
                    callback(true);
                });
            });

            it('should create the build directory', function() {
                zip.compress('./www', './build', function(e, path) {});
                expect(shell.mkdir).toHaveBeenCalledWith('-p', './build');
            });

            it('should copy the www/ contents to the build directory', function() {
                zip.compress('./www', './build', function(e, path) {});
                expect(shell.cp).toHaveBeenCalledWith(
                    '-r',
                    p.resolve('./www'),
                    './build' // @TODO we should resolve this path
                );
            });

            it('should copy my-app/config.xml when it exists', function() {
                fs.existsSync.andReturn(true);
                zip.compress('./www', './build', function(e, path) {});
                expect(shell.cp).toHaveBeenCalledWith(
                    p.resolve('./config.xml'),
                    p.resolve('./build/www')
                );
            });

            it('should not copy my-app/config.xml when it does not exist', function() {
                fs.existsSync.andReturn(false);
                zip.compress('./www', './build', function(e, path) {});
                expect(shell.cp).not.toHaveBeenCalledWith(
                    p.resolve('./config.xml'),
                    p.resolve('./build/www')
                );
            });

            it('should try to zip the www directory', function() {
                zip.compress('./www', './build', function(e, path) {});
                expect(shell.exec).toHaveBeenCalled();
            });

            describe('on Windows', function() {
                beforeEach(function() {
                    spyOn(os, 'type').andReturn('Windows_NT');
                });

                it('should use the Windows zip script', function() {
                    zip.compress('./www', './build', function(e, path) {});
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('wscript');
                });

                it('should use absolute paths', function() {
                    zip.compress('./www', './build', function(e, path) {});
                    expect(shell.exec.mostRecentCall.args[0]).toMatch(p.resolve('./build/www'));
                    expect(shell.exec.mostRecentCall.args[0]).toMatch(p.resolve('./build'));
                });

                it('should support spaces in input path', function() {
                    zip.compress('./path/to the/www', './build', function(e, path) {});
                    expect(shell.exec.mostRecentCall.args[0]).toMatch(
                        p.resolve('build/www.zip')
                    );
                });

                it('should support spaces in output path', function() {
                    zip.compress('./www', './path/to the/build', function(e, path) {});
                    expect(shell.exec.mostRecentCall.args[0]).toMatch(
                        p.resolve('./path/to the/build')
                    );
                });
            });

            describe('on non-Windows', function() {
                beforeEach(function() {
                    spyOn(os, 'type').andReturn('Darwin');
                });

                it('should use the zip command', function() {
                    zip.compress('./www', './build', function(e, path) {});
                    expect(shell.exec.mostRecentCall.args[0]).toMatch(/^zip/);
                });

                it('should support spaces in input path', function() {
                    zip.compress('./path/to the/www', './build', function(e, path) {});
                    expect(shell.exec.mostRecentCall.args[0]).toMatch(
                        p.resolve('build/www.zip')
                    );
                });

                it('should support spaces in output path', function() {
                    zip.compress('./www', './path/to the/build', function(e, path) {});
                    expect(shell.exec.mostRecentCall.args[0]).toMatch(
                        p.resolve('./path/to the/build')
                    );
                });
            });

            describe('successful zip', function() {
                beforeEach(function() {
                    shell.exec.andReturn({ code: 0 });
                });

                it('should trigger callback without an error', function(done) {
                    zip.compress('./www', './build', function(e, path) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with a zip path', function(done) {
                    zip.compress('./www', './build', function(e, path) {
                        expect(path).toMatch(p.join('build', 'www.zip'));
                        done();
                    });
                });
            });

            describe('failed zip', function() {
                beforeEach(function() {
                    shell.exec.andReturn({ code: 1 });
                });

                it('should cleanup the build directory', function() {
                    zip.compress('./www', './build', function(e, path) {});
                    expect(zip.cleanup).toHaveBeenCalled();
                });

                it('should trigger callback with an error', function(done) {
                    zip.compress('./www', './build', function(e, path) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });
            });
        });

        describe('path does not exist', function() {
            beforeEach(function() {
                fs.exists.andCallFake(function(path, callback) {
                    callback(false);
                });
            });

            it('should trigger callback with error', function(done) {
                zip.compress('./www', './build', function(e, zipPath) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    /*
     * zip.cleanup(zipPath);
     */

    describe('cleanup(zipPath)', function() {
        beforeEach(function() {
            spyOn(fs, 'existsSync');
            spyOn(fs, 'rmdir');
            spyOn(shell, 'rm');
        });

        describe('zip file exists', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(true);
            });

            it('should remove zip file', function() {
                zip.cleanup('build/www.zip');
                expect(shell.rm).toHaveBeenCalledWith('build/www.zip');
            });
        });

        describe('zip file does not exists', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(false);
            });

            it('should not throw error', function() {
                expect(function() {
                    zip.cleanup('build/www.zip');
                }).not.toThrow();
            });
        });

        describe('zip directory exists', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(true);
            });

            it('should try to remove zip directory', function() {
                zip.cleanup('build/www.zip');
                expect(fs.rmdir).toHaveBeenCalledWith('build');
            });
        });

        describe('zip directory does not exists', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(false);
            });

            it('should not throw error', function() {
                expect(function() {
                    zip.cleanup('build/www.zip');
                }).not.toThrow();
            });
        });
    });
});
