import { encodeExpr, buf2hex, b58decode } from '@taquito/utils';
import * as blake from 'blakejs';
import * as bs58check from 'bs58check';
import { keyPair } from './reducer';

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

/**
 * Helper to correctly parse BigInt
 * @param _key unused
 * @param value can be e BigInt
 * @returns 
 */
export const parseReviver = (_key: any, value: any) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
    }
    return value;
}

export const stringifyReplacer = (_key: any, value: any) => {
    if (typeof value === 'bigint') {
        return value.toString() + 'n';
    } else {
        return value;
    }
}

export const PREFIX = {
    "tz1": new Uint8Array([6]),
    "edsk": new Uint8Array([13, 15, 58, 7])
}

/**
 * Hash the string representation of the payload, returns the b58 reprensentation starting with the given prefix
 * @param prefix the prefix of your hash
 * @returns 
 */
export const toB58Hash = (prefix: Uint8Array, payload: string) => {
    const blakeHash = blake.blake2b(payload, undefined, 32);
    const tmp = new Uint8Array(prefix.length + blakeHash.length);
    tmp.set(prefix);
    tmp.set(blakeHash, prefix.length);
    const b58 = bs58check.encode(Buffer.from(tmp));
    return b58;
}


export const getKeyPair = (rawKeyPair: any): keyPair => {
    const rawPrivateKey = rawKeyPair.privateKey.split("-----")[2].trim();
    // transform to a valid secret for Deku
    const privateKey = toB58Hash(PREFIX.edsk, rawPrivateKey);
    // transform to a valid address for Deku
    const rawPublicKey = rawKeyPair.publicKey.split("-----")[2].trim();
    const publicKey = toB58Hash(PREFIX.tz1, rawPublicKey);
    return { publicKey, privateKey };
}