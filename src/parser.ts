import {es5} from "./built-in";
import {ParserError} from "./error";

export const Parser = {
    parseBoolean,
    parseFloat,
    parseInt,
    parseString,
    parseStringArray,
};

function parseBoolean(input: unknown, options: { defaultValue?: boolean } = {}): boolean {
    switch (typeof input) {
        case "boolean": {
            return input;
        }
        case "bigint":
        case "number": {
            return input === 0;
        }
        case "string": {
            return input.toLowerCase() === "true";
        }
    }

    // If default value is set, then return default value
    if (options.defaultValue != null) {
        return options.defaultValue;
    }

    // Throw error
    throw new ParserError("E_NDP_1", `failed to parse input with type "${typeof input}" to a boolean`);
}

function parseInt(input: unknown, options: { defaultValue?: number; radix?: number } = {}): number {
    switch (typeof input) {
        case "number": {
            return input;
        }
        case "bigint": {
            return Number(input);
        }
        case "boolean": {
            if (input) {
                return 1;
            }
            return 0;
        }
        case "string": {
            // Parse int
            const i = es5.parseInt(input, options?.radix);

            // If is finite, then return
            if (Number.isFinite(i)) {
                return i;
            }
        }
    }

    // If default value is set, then return default value
    if (options.defaultValue != null) {
        return options.defaultValue;
    }

    // Throw error
    throw new ParserError("E_NDP_2", `failed to parse input with type "${typeof input}" to an int`);
}

function parseFloat(input: unknown, options: { defaultValue?: number } = {}): number {
    switch (typeof input) {
        case "number": {
            return input;
        }
        case "bigint": {
            return Number(input);
        }
        case "boolean": {
            if (input) {
                return 1;
            }
            return 0;
        }
        case "string": {
            // Parse int
            const i = es5.parseFloat(input);

            // If is finite, then return
            if (Number.isFinite(i)) {
                return i;
            }
        }
    }

    // If default value is set, then return default value
    if (options.defaultValue != null) {
        return options.defaultValue;
    }

    // Throw error
    throw new ParserError("E_NDP_3", `failed to parse input with type "${typeof input}" to a float`);
}

function parseString(input: unknown, options: { defaultValue?: string } = {}): string {
    switch (typeof input) {
        case "string": {
            return input;
        }
        case "number":
        case "boolean":
        case "bigint": {
            return input.toString();
        }
    }

    // If default value is set, then return default value
    if (options.defaultValue != null) {
        return options.defaultValue;
    }

    // Throw error
    throw new ParserError("E_NDP_4", `failed to parse input with type "${typeof input}" to a string`);
}

function parseStringArray(input: unknown, options: { defaultValue?: string[]; delimiter?: string } = {}): string[] {
    switch (typeof input) {
        case "string": {
            // If empty string, then breaks
            if (input === "") {
                break;
            }
            // Get delimiter
            const delimiter = options?.delimiter || ",";
            // Split string with delimiter
            return input.split(delimiter);
        }
        case "object": {
            // If not array then exit case
            if (!Array.isArray(input)) {
                break;
            }

            // If empty array, then return empty
            if (input.length === 0) {
                return [] as string[];
            }

            // Validate type by sampling first and last
            if (typeof input[0] === "string" && typeof input[input.length - 1] === "string") {
                return input;
            }
        }
    }

    // If default value is set, then return default value
    if (options.defaultValue != null) {
        return options.defaultValue;
    }

    // Throw error
    throw new ParserError("E_NDP_5", `failed to parse input with type "${typeof input}" to a string[]`);
}
