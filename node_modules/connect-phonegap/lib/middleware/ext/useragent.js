/*!
 * Module dependencies.
 */

var useragent = require('useragent');

/**
 * Parse User-Agent for Cordova Platform.
 *
 * Options:
 *
 *   - `ua` {String} is the server request user-agent header.
 *   - `[jsUA]` {String} is the optional user-agent from the client-side JS.
 *
 * Returns:
 *
 *   - {Object} to describe the platform.
 *     - `ios` {Boolean} true when iOS.
 *     - `android` {Boolean} true when Android.
 *     - `platform` {String} is the platform name (`ios`, `android`, etc).
 */

module.exports.parse = function() {
    var agent = useragent.parse.apply(useragent, arguments),
        browser = agent.toAgent(),
        platform = {};

    // find the user-agent's platform
    platform = {
        // test against "Chrome Mobile" for Android 4.4.2 support
        android: /Android/i.test(browser) || /Chrome Mobile/i.test(browser),
        ios: /Mobile Safari/i.test(browser),
        wp8: /IE Mobile/i.test(browser),
        platform: 'browser'
    };

    // .platform is the stringified platform name
    for (var key in platform) {
        if (platform[key] && key !== 'platform') {
            platform.platform = key;
            break;
        }
    }

    return platform;
};
