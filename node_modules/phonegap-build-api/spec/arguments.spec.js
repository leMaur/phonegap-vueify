var Arguments = require('../lib/arguments');

describe('new Arguments', function() {
    describe('path', function() {
        it('should parse from arguments', function() {
            // only path
            var args = new Arguments('/apps');
            expect(args.path).toEqual('/apps');

            // with options
            args = new Arguments('/apps', {});
            expect(args.path).toEqual('/apps');

            // with function
            args = new Arguments('/apps', {}, function() {});
            expect(args.path).toEqual('/apps');
        });

        //it('support placeholders and variables', function() {
        //    var args = new Arguments('/apps/:id/build/:platform', 10, 'android', function() {});
        //    expect(args.path).toEqual('/apps/10/build/android');
        //});

        it('should be required', function() {
            expect(function() {
                var args = new Arguments();
            }).toThrow();

            expect(function() {
                var args = new Arguments({});
            }).toThrow();

            expect(function() {
                var args = new Arguments({}, function() {});
            }).toThrow();
        });

        describe('trimming', function() {
            it('should remove extra leading slashes', function() {
                var args = new Arguments('///apps/10');
                expect(args.path).toEqual('/apps/10');
            });

            it('should remove extra trailing slashes', function() {
                var args = new Arguments('/apps/10///');
                expect(args.path).toEqual('/apps/10');
            });

            it('should remove extra leading whitespace', function() {
                var args = new Arguments('  //apps/10', function() {});
                expect(args.path).toEqual('/apps/10');
            });

            it('should remove extra trailing whitespace', function() {
                var args = new Arguments('  /apps/10//  ', function() {});
                expect(args.path).toEqual('/apps/10');
            });
        });
    });

    describe('options', function() {
        it('should parse from arguments', function() {
            // with path
            args = new Arguments('/apps', { method: 'POST' });
            expect(args.options).toEqual({ method: 'POST' });

            // with function
            args = new Arguments('/apps', { method: 'POST' }, function() {});
            expect(args.options).toEqual({ method: 'POST' });
        });

        it('should not be required', function() {
            expect(function() {
                var args = new Arguments('/apps');
            }).not.toThrow();
        });

        it('should default to {}', function() {
            var args = new Arguments('/apps');
            expect(args.options).toEqual({});
        });
    });

    describe('callback', function() {
        it('should parse from arguments', function() {
            var callback = function(e, data) {};
            // with path
            args = new Arguments('/apps', callback);
            expect(args.callback).toEqual(callback);

            // with options
            args = new Arguments('/apps', { method: 'POST' }, callback);
            expect(args.callback).toEqual(callback);
        });

        it('should not be required', function() {
            expect(function() {
                var args = new Arguments('/apps');
            }).not.toThrow();

            expect(function() {
                var args = new Arguments('/apps', {});
            }).not.toThrow();
        });

        it('should default to empty function', function() {
            var args = new Arguments('/apps');
            expect(args.callback).toEqual(jasmine.any(Function));
        });
    });
});
