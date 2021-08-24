export enum GroupDataType {
    // null, undefined
    EMPTY,
    // bigint, number, boolean, string, symbol
    PRIMITIVE,
    // function
    FUNCTION,
    // array
    ARRAY,
    // object
    OBJECT,
}

/**
 * Get group of data type from value
 *
 * @param {*} [v] Value
 * @return {GroupDataType} Group of Data Type
 */
export function getGroupDataType(v: unknown): GroupDataType {
    // Check if value is empty
    if (v == null) {
        return GroupDataType.EMPTY;
    }

    // Switch by typeof
    switch (typeof v) {
        case "number":
        case "string":
        case "boolean":
        case "bigint":
        case "symbol": {
            return GroupDataType.PRIMITIVE;
        }
        case "function": {
            return GroupDataType.FUNCTION;
        }
    }

    // Check if array
    if (Array.isArray(v)) {
        return GroupDataType.ARRAY;
    }

    return GroupDataType.OBJECT;
}

export function isObject(v: unknown): boolean {
    return getGroupDataType(v) === GroupDataType.OBJECT;
}
