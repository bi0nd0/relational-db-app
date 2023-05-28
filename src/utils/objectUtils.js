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
 * @param {Object} memory - The memory object to store the value.
 * @param {...string} args - The keys in the memory object, followed by the value to be assigned.
 *                           The last argument is always the value to be assigned, and the preceding
 *                           arguments are the nested keys.
 */
export function assignValue(object={}, ...args) {
    const value = args.pop();
    let currentObj = object;

    for (let i = 0; i < args.length - 1; i++) {
        const key = args[i];

        if (!currentObj[key]) {
        currentObj[key] = {};
        }

        currentObj = currentObj[key];
    }

    const finalKey = args[args.length - 1];
    currentObj[finalKey] = value;
}