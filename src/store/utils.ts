import { encodeExpr, buf2hex, b58decode } from '@taquito/utils';

/**
 * Create a random nonce, like in Deku
 * @returns random integer
 */
export const createNonce = (): number => {
    const maxInt32 = 2147483647;
    const nonce = Math.floor(Math.random() * maxInt32);
    return nonce;
}

export const stringToHex = (payload: string): string => {
    const input = Buffer.from(payload);
    return buf2hex(input);
}

export const createHash = (jsonToHash: string): string => {
    return b58decode(encodeExpr(stringToHex(jsonToHash))).slice(4, -2);
}