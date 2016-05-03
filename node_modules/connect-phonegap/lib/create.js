/*!
 * Module dependencies.
 */

var events = require('events'),
    fs = require('fs'),
    home = require('home-dir'),
    path = require('path'),
    progress = require('request-progress'),
    request = require('request'),
    shell = require('shelljs'),
    tar = require('tar'),
    zlib = require('zlib'),
    emitter = new events.EventEmitter();

/**
 * Create a project.
 *
 * The project is created from the same app template used by the PhoneGap CLI
 * and Cordova CLI. When a template does not exist, it is fetched and saved
 * in the common directory:
 *
 *     ~/.cordova/lib/www/com.phonegap.hello-world/VERSION/
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `path` {String} is the path to create the project.
 *     - `version` {String} defines the PhoneGap app version.
 *
 * Events:
 *
 *   - `progress` emits state while downloading the app template.
 *     - `state` {Object} with `received`, `total`, and `percentage`.
 *   - `error` emitted when an error occurs.
 *     - `e` {Error}
 *   - `complete` emits when the project has been created.
 *     - `data` {Object} is indentical to the input `options`.
 *
 * Example:
 *
 *     phonegap.create({
 *         path: 'path/to/app',
 *         version: '3.3.0'
 *     })
 *     .on('progress', function(state) {
 *         // only emitted when downloading a template
 *     }
 *     .on('error', function(e) {
 *         // handle error
 *     })
 *     .on('complete', function(data) {
 *         // data.path is the app path
 *     });
 */

module.exports = function(options) {
    var self = module.exports;

    // required parameters
    if (!options) throw new Error('options parameter is required');
    if (!options.path) throw new Error('options.path parameter is required');
    if (!options.version) throw new Error('options.version parameter is required');

    // allow caller to subscribe to the events
    process.nextTick(function() {
        self.validateProjectPath(options, function(e) {
            if (e) return emitter.emit('error', e);
            self.fetchTemplate(options, function(e) {
                if (e) return emitter.emit('error', e);
                self.createProject(options, function(e) {
                    if (e) return emitter.emit('error', e);
                    emitter.emit('complete', options);
                });
            });
        });
    });

    return emitter;
};

/*!
 * Validate the project path.
 *
 * Asserts that it's safe to create a project at the path.
 * The path must be an empty or non-existent directory.
 *
 * Options:
 *
 *   - `options` {Object} should match the create options.
 *   - `callback` {Function} called on complete
 *     - `e` {Error} is null unless there was an error.
 */

module.exports.validateProjectPath = function(options, callback) {
    var e = null;

    // project path must be empty or non-existent
    if (fs.existsSync(options.path)) {
        var files = fs.readdirSync(options.path);
        // empty directory includes '.' and '..'
        if (files.length > 2) {
            e = new Error('project path cannot contain files');
        }
    }

    callback(e);
};

/*!
 * Fetch the App Template
 *
 * Ensures that the template exists locally. If it does not, then the template
 * is downloaded and installed the the global Cordova directory.
 *
 * Options:
 *
 *   - `options` {Object} should match the create options.
 *   - `callback` {Function} called on complete
 *     - `e` {Error} is null unless there was an error.
 */

module.exports.fetchTemplate = function(options, callback) {
    // use local project template if it exists
    if (module.exports.templateExists(options)) {
        callback();
    }
    // otherwise remove corrupt templates and download it
    else {
        module.exports.deleteInvalidTemplate(options);
        module.exports.downloadTemplate(options, callback);
    }
};

/*!
 * Check if App Template Exists.
 *
 * Attempts to find the template locally.
 *
 * Options:
 *
 *   - `options` {Object} should match the create options.
 *
 * Returns:
 *
 *   {Boolean} true if the app template exists locally.
 */

module.exports.templateExists = function(options) {
    var templatePath = module.exports.templatePath(options);
    return fs.existsSync(templatePath) && module.exports.configXMLExists(templatePath);
};

/*!
 * Check if config.xml exists in the Template.
 *
 * Attempts to find the config.xml locally.
 *
 * Options:
 *
 *   - `templatePath` String path to the template directory.
 *
 * Returns:
 *
 *   {Boolean} true if config.xml exists in the local template directory.
 */

module.exports.configXMLExists = function(templatePath) {
    return fs.existsSync(path.join(templatePath, 'config.xml')) || fs.existsSync(path.join(templatePath, 'www/config.xml'));
};

/*!
 * Delete Existing Template When Invalid.
 *
 * Occassionally, the fetching of a template fails and produces an empty
 * directory. This method will delete the template directory if it is
 * corrupt otherwise leave it untouched.
 *
 * Options:
 *
 *   - `options` {Object} should match the create options.
 */

module.exports.deleteInvalidTemplate = function(options) {
    var templatePath = module.exports.templatePath(options);
    if (fs.existsSync(templatePath) && !module.exports.configXMLExists(templatePath)) {
        shell.rm('-r', templatePath);
    }
};

/*!
 * Download, Extract, and Install App Template.
 *
 * The downloaded template is installed to the global Cordova directory.
 *
 * Options:
 *
 *   - `options` {Object} should match the create options.
 *   - `callback` {Function} called on complete
 *     - `e` {Error} is null unless there was an error.
 */

module.exports.downloadTemplate = function(options, callback) {
    var destinationPath = module.exports.templatePath(options),
        url = 'https://github.com/phonegap/phonegap-app-hello-world/archive/master.tar.gz';

    // do not require callback
    callback = callback || function(e) {};

    // create destination directory for template app
    shell.mkdir('-p', destinationPath);
    if (shell.error()) return callback(shell.error());

    // download the template app
    progress(request(url), {
        throttle: 500
    })
    .on('progress', function (state) {
        emitter.emit('progress', state);
    })
    .on('error', function (e) {
        callback(e);
    })
    .pipe(zlib.createUnzip())
    .on('error', function(e) {
        callback(e);
    })
    .pipe(tar.Extract({
        path: destinationPath, // ~/.cordova/lib/www/phonegap/x.x.x/
        strip: 1               // only save the contents
    }))
    .on('error', function(e) {
        callback(e);
    })
    .on('end', function() {
        callback(null);
    });
};

/*!
 * Creates the Project from App Template.
 *
 * Once we're positive that the template exists locally, the project
 * is created at the given path.
 *
 * Options:
 *
 *   - `options` {Object} should match the create options.
 *   - `callback` {Function} called on complete
 *     - `e` {Error} is null unless there was an error.
 */

module.exports.createProject = function(options, callback) {
    // do not require callback
    callback = callback || function(e) {};

    // resolve the full path
    options.path = path.resolve(options.path);

    // create path leading up to the project
    shell.mkdir('-p', options.path);
    if (shell.error()) return callback(shell.error());

    // copy template project to the destination path
    shell.cp('-R', path.join(module.exports.templatePath(options), 'www'), options.path);

    // create additional Cordova directories
    shell.mkdir('-p', [
        path.join(options.path, '.cordova'),
        path.join(options.path, 'hooks'),
        path.join(options.path, 'platforms'),
        path.join(options.path, 'plugins')
    ]);

    if (shell.error()) return callback(shell.error());

    // move config.xml to root of project for legacy app templates
    var configXML = {
        projectPath: path.join(options.path, 'config.xml'),
        wwwPath: path.join(options.path, 'www', 'config.xml')
    };
    if (fs.existsSync(configXML.wwwPath)) {
        fs.renameSync(configXML.wwwPath, configXML.projectPath);
    }

    callback(null);
};

/*!
 * Template Path.
 *
 * The path to find or install a given app template of a certain version.
 *
 * Options:
 *
 *   - `options` {Object} should match the create options.
 *
 * Returns:
 *
 *   {String} is absolute path to the app template directory.
 */

module.exports.templatePath = function(options) {
    return path.join(
        home.directory, '.cordova', 'lib', 'www', 'com.phonegap.hello-world', 'master'
    );
}
