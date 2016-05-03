/**
 * Extend an object.
 *
 * Creates a new object that merges the `overrides` into
 * the `defaults` object.
 *
 * Options:
 *
 *   - `defaults` {Object} is the default values to return.
 *   - `overrides` {Object} will be merged into `defaults`.
 *
 * Returns:
 *
 *   A new {Object}.
 */

module.exports = function extend(defaults, overrides) {
    var result = {},
        key;

    for (key in defaults) {
        result[key] = defaults[key];
    }

    for (key in overrides) {
        if (overrides[key] !== undefined) {
            result[key] = overrides[key];
        }
    }

    return result;
};
