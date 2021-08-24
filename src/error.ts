export class ParserError extends Error {
    code: string;
    readonly success: boolean;

    constructor(code: string, message: string) {
        super(message);
        this.success = false;
        this.code = code;
    }
}
