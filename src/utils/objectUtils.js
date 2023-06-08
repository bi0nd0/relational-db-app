export function checkKeys(target, ...keys) {
    let currentObj = target;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (currentObj.hasOwnProperty(key)) {
        currentObj = currentObj[key];
        } else {
        return false;
        }
    }

    return true;
}

/**
 * Assigns a value to a nested key in an object.
 *
 * @param {Object} object - The object were to store the value.
 * @param {...string} args - The keys in the object, followed by the value to be assigned.
 *                           The last argument is always the value to be assigned, and the preceding
 *                           arguments are the nested keys.
 */
export function assignValue(object={}, ...args) {
    const value = args.pop(); // remove the last item, i.e.: the value
    let currentObj = object;


    for (let i = 0; i < args.length - 1; i++) {
        const key = args[i];
        // make sure each nested item exists
        if (typeof currentObj[key] == 'undefined') currentObj[key] = {};
        if (typeof currentObj[key] !== 'object') throw Error('cannot assign a value to a non-object');

        currentObj = currentObj[key];
    }

    const finalKey = args[args.length - 1];
    currentObj[finalKey] = value;
}