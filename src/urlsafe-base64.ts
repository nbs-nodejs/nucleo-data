/*
 * Forked from https://github.com/RGBboy/urlsafe-base64
 *
 * License
 *
 * (The MIT License)
 *
 * Copyright (c) 2014 RGBboy <l-_-l@rgbboy.com>
 * Copyright (c) 2021 Saggaf <saggaf@nusantarabetastudio.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * return an encoded Buffer as URL Safe Base64
 *
 * Note: This function encodes to the RFC 4648 Spec where '+' is encoded
 *       as '-' and '/' is encoded as '_'. The padding character '=' is
 *       removed.
 *
 * @param {Buffer} [input] character buffer
 * @return {String}
 * @api public
 */
const encode = (input: Buffer): string => {
    return input
        .toString("base64")
        .replace(/\+/g, "-") // Convert '+' to '-'
        .replace(/\//g, "_") // Convert '/' to '_'
        .replace(/=+$/, ""); // Remove ending '='
};

/**
 * return an decoded URL Safe Base64 as Buffer
 *
 * @param {String} [base64] URL Safe Base64 string
 * @return {Buffer}
 * @api public
 */
const decode = (base64: string): Buffer => {
    // Add removed at end '='
    base64 += Array(5 - (base64.length % 4)).join("=");

    base64 = base64
        .replace(/-/g, "+") // Convert '-' to '+'
        .replace(/_/g, "/"); // Convert '_' to '/'

    return Buffer.from(base64, "base64");
};

/**
 * Validates a string if it is URL Safe Base64 encoded.
 *
 * @param {String} [base64] Base64 string
 * @return {Boolean}
 * @api public
 */
const isSafe = (base64: string): boolean => {
    return /^[A-Za-z0-9\-_]+$/.test(base64);
};

export const UrlSafeBase64 = {
    encode,
    decode,
    isSafe,
};
