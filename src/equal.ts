import {getGroupDataType, GroupDataType} from "./group-data-type";

/**
 * Deep compare between two array value. Array is considered equal when:
 *   1. Array have the same length
 *   2. Each array item have the same value
 *
 * @param {*[]} a1 Array value for compare
 * @param {*[]} a2 Array value for compare
 * @return {boolean} Equal or Not Equal
 */
export function isArrayEqual(a1: unknown[], a2: unknown[]): boolean {
    // Check by empty-ness
    if (a1.length + a2.length === 0) {
        return true;
    }

    // Check by length
    if (a1.length !== a2.length) {
        return false;
    }

    // Check through items
    for (let i = 0; i < a1.length; i++) {
        if (!isEqual(a1[i], a2[i])) {
            return false;
        }
    }

    return true;
}

/**
 * Deep compare between two values
 *
 * @param {*} [v1] Value 1
 * @param {*} [v2] Value 2
 * @return {boolean} Equal or Not Equal
 */
export function isEqual(v1: unknown, v2: unknown): boolean {
    // Get Group of data type
    const gt1 = getGroupDataType(v1);
    const gt2 = getGroupDataType(v2);

    // If group is different, then return false
    if (gt1 !== gt2) {
        return false;
    }

    // Get gt1 as sample and switch case group data type
    switch (gt1) {
        case GroupDataType.EMPTY:
        case GroupDataType.PRIMITIVE: {
            // If EMPTY of PRIMITIVES, then use string equality operator
            return v1 === v2;
        }
        case GroupDataType.FUNCTION: {
            // If FUNCTION, then throw error
            throw new Error("cannot compare a function type");
        }
        case GroupDataType.ARRAY: {
            // If ARRAY, then call isArrayEqual
            return isArrayEqual(v1 as unknown[], v2 as unknown[]);
        }
    }

    // Values are an object
    const o1 = v1 as Record<string, unknown>;
    const o2 = v2 as Record<string, unknown>;

    // Check by constructor name
    if (o1.constructor.name !== o2.constructor.name) {
        return false;
    }

    // Get keys
    const k1 = Object.keys(o1);
    const k2 = Object.keys(o2);

    // Check by key length
    if (k1.length !== k2.length) {
        return false;
    }

    // Check if keys is available on the others
    for (let i = 0; i < k1.length; i++) {
        // If key is not available, then the object is different
        if (!k2.includes(k1[i])) {
            return false;
        }
    }

    // Check if value are the same
    for (let i = 0; i < k1.length; i++) {
        // If key is not available, then the object is different
        const k = k1[i];
        if (!isEqual(o1[k], o2[k])) {
            return false;
        }
    }

    // Values are equal
    return true;
}
