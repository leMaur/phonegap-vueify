/*!
 * Module dependencies.
 */

var events = require('events'),
    util = require('util');

/**
 * PhoneGap Build object.
 *
 * Events:
 *
 *   - `error` {Event} triggered with info compatible with console.error.
 *     - `e` {Error} describes the error.
 *   - `log` {Event} triggered with info compatible with console.log.
 *   - `warn` {Event} triggered with info compatible with console.warn.
 *   - `raw` {Event} trigger with info that should not be formatted.
 *   - `login` {Event} triggered when login credentials are needed.
 *     - `callback` {Function} is triggered with user credentials
 *       - `username` {String}
 *       - `password` {String}
 */

function PhoneGapBuild() {
    // error events must always have a listener.
    this.on('error', function(e) {});
}

util.inherits(PhoneGapBuild, events.EventEmitter);

/*
 * PhoneGap Build prototype chain composed of isolated actions.
 */

PhoneGapBuild.prototype.login = require('./phonegap-build/login');
PhoneGapBuild.prototype.logout = require('./phonegap-build/logout');
PhoneGapBuild.prototype.create = require('./phonegap-build/create');
PhoneGapBuild.prototype.build = require('./phonegap-build/build');

/*
 * Expose the PhoneGapBuild object.
 */

module.exports = PhoneGapBuild;
