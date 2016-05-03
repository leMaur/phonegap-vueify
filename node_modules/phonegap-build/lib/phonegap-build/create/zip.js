/*
 * Module dependencies.
 */

var shell = require('shelljs'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    os = require('os');

/**
 * Zip a Directory.
 */

module.exports = {

    /**
     * Zip a Directory.
     *
     * Options:
     *
     *   - `wwwPath` {String} is the path to the application's www/.
     *   - `buildPath` {String} is the path to the application's build/.
     *   - `callback` {Function} is trigger after the compress.
     *     - `e` {Error} is null unless there is an error.
     *     - `zipPath` {String} is the path to the zip archive.
     */

    compress: function(wwwPath, buildPath, callback) {
        // require parameters
        if (!wwwPath) throw new Error('missing www/ path argument');
        if (!buildPath) throw new Error('missing build/ path argument');
        if (!callback) throw new Error('missing callback argument');

        fs.exists(wwwPath, function(exists) {
            if (!exists) {
                callback(new Error('www path does not exist: ' + wwwPath));
                return;
            }

            // Phonegap Build expects 'www' to be at the root level in the
            // ZIP-file - we'll keep the oldDir to CD back after the ZIP's
            // been created.
            var oldDir = shell.pwd();
            shell.cd(wwwPath);

            // make build directory
            shell.mkdir('-p', buildPath);

            // set the output zip path
            var zipPath = path.resolve(buildPath, 'www.zip'),
                inputPath = path.resolve(wwwPath),
                configPath = path.resolve(path.join(inputPath, '..', 'config.xml')),
                buildWWWPath = path.resolve(path.join(buildPath, 'www'));

            // copy my-app/www/ to <buildPath>/www/ directory
            shell.cp('-r', inputPath, buildPath);

            // copy my-app/config.xml to temp directory, when it exists
            if (fs.existsSync(configPath)) {
                shell.cp(configPath, buildWWWPath);
            }

            // shell out to zip. For windows, use native script.
            var cmd = util.format('zip -r "%s" "%s"', zipPath, buildWWWPath);

            if (os.type() === "Windows_NT") {
                cmd = util.format(
                    'wscript "%s" "%s" "%s"',
                    path.join(__dirname, '..', '..', '..', 'res', 'windows', 'zip.js'),
                    zipPath,
                    buildWWWPath
                );
            }

            var out = shell.exec(cmd, { silent: true });

            // remove temporary www directory
            shell.rm('-r', buildWWWPath);

            // Change back to old directory due to implicit assumptions
            // on the current working directory elsewhere in the script.
            shell.cd(oldDir);

            if (out.code !== 0) {
                module.exports.cleanup(zipPath);
                callback(new Error('failed to create the zip file: ' + out.output));
            }
            else {
                callback(null, zipPath);
            }
        });
    },

    /**
     * Cleanup Zip Archive.
     *
     * Deletes the zip archive created by `compress(path, callback)` and removes
     * the parent directory if empty.
     *
     * Options:
     *
     *   - `zipPath` {String} is the path to the zip archive.
     */

    cleanup: function(zipPath) {
        var exists,
            basepath = path.dirname(zipPath);

        // remove zip file
        exists = fs.existsSync(zipPath);
        if (exists) {
            shell.rm(zipPath);
        }

        // remove zip directory if empty
        exists = fs.existsSync(basepath);
        if (exists) {
            fs.rmdir(basepath);
        }
    }
};
