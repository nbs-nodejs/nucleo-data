import {getGroupDataType, GroupDataType, isObject} from "./group-data-type";
import {isArrayEqual, isEqual} from "./equal";

export interface AttributeOption {
    skip?: boolean;
    required?: boolean;
}

export function getDiff(
    v1: unknown,
    v2: unknown,
    options?: {
        depth?: number;
        maxDepth?: number;
        keys?: string[];
        exclude?: string[];
        attributes?: Record<string, AttributeOption>;
    }
): { isEqual: boolean; keys: string[]; values: Record<string, unknown>; details: Record<number, string[]> } {
    // Check v1 and v2 is an object
    if (!isObject(v1) || !isObject(v2)) {
        throw new Error("v1 or v2 is not an object");
    }

    // Cast value to object
    const o1 = v1 as Record<string, unknown>;
    const o2 = v2 as Record<string, unknown>;

    // Get options
    const depth = options?.depth || 0;
    const maxDepth = options?.maxDepth || 0;
    const keys = options?.keys || Object.keys(o1);
    const attributes = options?.attributes || {};

    // Init empty result
    const diffKeys = [] as string[];
    const diffValues: Record<string, unknown> = {};
    const diffDetails: Record<number, string[]> = {};

    for (let i = 0; i < keys.length; i++) {
        // Get sample key
        const k = keys[i];

        // Get attribute options, if not set, then set as required
        const attrOpt = attributes[k] || {required: true};

        // If exclude, then continue
        if (attrOpt.skip) {
            continue;
        }

        // Get entries from both object
        const e1 = o1[k];
        const e2 = o2[k];

        // Get group data type
        const gt1 = getGroupDataType(o1[k]);
        const gt2 = getGroupDataType(o2[k]);

        // If required but gt2 is EMPTY, then skip
        if (attrOpt.required && gt2 === GroupDataType.EMPTY) {
            continue;
        }

        // If group data type is not equal, then value must be different
        if (gt1 !== gt2) {
            diffKeys.push(k);
            diffValues[k] = e2;
            continue;
        }

        // Switch by sample group data type
        switch (gt1) {
            case GroupDataType.EMPTY:
            case GroupDataType.PRIMITIVE: {
                // Check by strict comparison
                if (e1 !== e2) {
                    diffKeys.push(k);
                    diffValues[k] = e2;
                }
                continue;
            }
            case GroupDataType.FUNCTION: {
                // Skip function
                continue;
            }
            case GroupDataType.ARRAY: {
                const arrayEqual = isArrayEqual(e1 as unknown[], e2 as unknown[]);
                if (!arrayEqual) {
                    diffKeys.push(k);
                    diffValues[k] = e2;
                }
                continue;
            }
        }

        // Values are object
        // If depth has reached max depth, then compare equality of object entries
        if (depth === maxDepth) {
            if (!isEqual(e1, e2)) {
                diffKeys.push(k);
                diffValues[k] = e2;
            }
            continue;
        }

        // Else, deep compare
        const nextDepth = depth + 1;
        const deepCompareResult = getDiff(e1, e2, {depth: nextDepth, maxDepth});
        if (!deepCompareResult.isEqual) {
            diffKeys.push(k);
            diffValues[k] = e2;
            diffDetails[nextDepth] = deepCompareResult.keys;
            // Merge details from deep compare
            Object.assign(diffDetails, deepCompareResult.details);
        }
    }

    return {
        values: diffValues,
        details: diffDetails,
        keys: diffKeys,
        isEqual: diffKeys.length === 0,
    };
}

export enum ArrayOp {
    REMOVED,
    ADDED,
    UPDATED,
}

export type ArrayDiffDetails = Record<number, { op: ArrayOp; value: unknown }>;

export function getMin(v1: number, v2: number): number {
    if (v2 < v1) {
        return v2;
    }
    return v1;
}

export function getArrayDiff(
    a1: unknown[],
    a2: unknown[]
): { isEqual: boolean; indexes: number[]; details: ArrayDiffDetails } {
    // Check by empty-ness
    if (a1.length + a2.length === 0) {
        return {isEqual: true, indexes: [], details: {}};
    }

    // Init result values
    const indexes: number[] = [];
    const details: ArrayDiffDetails = {};

    // Init minimum length to check
    const minIndex = getMin(a1.length, a2.length);

    // Check through items by minimum index
    for (let i = 0; i < minIndex; i++) {
        // Check equality
        const v1 = a1[i],
            v2 = a2[i];

        // If values are not equal then set details
        if (!isEqual(v1, v2)) {
            indexes.push(i);
            details[i] = {op: ArrayOp.UPDATED, value: v2};
        }
    }

    // If source length is greater than minimum length, then set add details
    if (a1.length > minIndex) {
        for (let i = minIndex; i < a1.length; i++) {
            details[i] = {op: ArrayOp.REMOVED, value: undefined};
            indexes.push(i);
        }
    } else if (a2.length > minIndex) {
        // If source length is less than minimum length, then set remove details
        for (let i = minIndex; i < a2.length; i++) {
            details[i] = {op: ArrayOp.ADDED, value: a2[i]};
        }
    }

    return {isEqual: indexes.length === 0, indexes, details};
}

/**
 * Convert a changelog object to array. Changelog object contains a string key and boolean value
 *
 * @param {object} [c] Changelog Object
 * @return {string[]} Array of changelog keys
 */
export function getChangelogArray(c: Record<string, boolean>): string[] {
    return Object.entries(c).reduce((result, [k, v]) => {
        if (v === true) {
            result.push(k);
        }
        return result;
    }, [] as string[]);
}
