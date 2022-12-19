import { buf2hex } from '@taquito/utils';
import * as blake from 'blakejs';
import bs58check from 'bs58check';
import { action, updateBuildingBanks, updateBuildingFactories, updateBuildingFarms, updateBuildingTemples, updateCursorBasket, updateDrillingMines, updateOven, updateRecruitingGrandmas } from './actions';
import { cookieBaker, initialState } from './cookieBaker';
import { keyPair, state } from './reducer';

export type leaderBoard = { address: string, cookieBaker: cookieBaker }

export const stringToHex = (payload: string): string => {
    const input = Buffer.from(payload);
    return buf2hex(input);
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

export const getPlayerState = (state: { [x: string]: any }, userAddress: string) => {
    const rawCookieBaker = state[userAddress];
    console.log("rawCookieBaker: ", rawCookieBaker);
    if (rawCookieBaker) {
        const flattenRawCookieBaker = rawCookieBaker.flat(4);
        console.log("flattenRawCookieBaker: ", flattenRawCookieBaker);
        const cookieBaker = {
            authorizedKeys: flattenRawCookieBaker[0],
            passiveCPS: flattenRawCookieBaker[15],
            cookies: flattenRawCookieBaker[3],
            cursors: flattenRawCookieBaker[5],
            grandmas: flattenRawCookieBaker[12],
            farms: flattenRawCookieBaker[10],
            mines: flattenRawCookieBaker[14],
            factories: flattenRawCookieBaker[7],
            cursorCost: flattenRawCookieBaker[4],
            grandmaCost: flattenRawCookieBaker[11],
            farmCost: flattenRawCookieBaker[9],
            mineCost: flattenRawCookieBaker[13],
            factoryCost: flattenRawCookieBaker[8],
            eatenCookies: flattenRawCookieBaker[6],
            templeCost: flattenRawCookieBaker[16],
            temples: flattenRawCookieBaker[17],
            banks: flattenRawCookieBaker[2],
            bankCost: flattenRawCookieBaker[1]
        }
        return cookieBaker;
    } else {
        return initialState;
    }
}

export const getLeaderBoardFromState = (state: { [x: string]: any }, userAddress: string) => {
    const cookieBaker = getPlayerState(state, userAddress);
    const element: leaderBoard = {
        address: userAddress, cookieBaker: cookieBaker
    };
    return element;
}

export const updatePendings = (playerState: cookieBaker, appState: React.MutableRefObject<state>, dispatch: React.Dispatch<action>) => {
    if (playerState.cookies > appState.current.cookieBaker.cookies) {
        const inOven =
            BigInt(appState.current.cookiesInOven) -
            (BigInt(playerState.cookies) - BigInt(appState.current.cookieBaker.cookies));
        if (BigInt(inOven) < 0n) dispatch(updateOven(0n));
        else dispatch(updateOven(inOven));
    }
    if (playerState.cursors > appState.current.cookieBaker.cursors) {
        const building =
            BigInt(appState.current.cursorsInBasket) -
            (BigInt(playerState.cursors) - BigInt(appState.current.cookieBaker.cursors));
        if (BigInt(building) < 0n) dispatch(updateCursorBasket(0n));
        else dispatch(updateCursorBasket(building));
    }
    // TODO: this is duplicated logic from cursor in basket etc. Abstract into a function
    if (playerState.grandmas > appState.current.cookieBaker.grandmas) {
        const building =
            BigInt(appState.current.recruitingGrandmas) -
            (BigInt(playerState.grandmas) - BigInt(appState.current.cookieBaker.grandmas));
        if (BigInt(building) < 0n) dispatch(updateRecruitingGrandmas(0n));
        else dispatch(updateRecruitingGrandmas(building));
    }
    if (playerState.farms > appState.current.cookieBaker.farms) {
        const building =
            BigInt(appState.current.buildingFarms) -
            (BigInt(playerState.farms) - BigInt(appState.current.cookieBaker.farms));
        if (BigInt(building) < 0n) dispatch(updateBuildingFarms(0n));
        else dispatch(updateBuildingFarms(building));
    }
    if (playerState.mines > appState.current.cookieBaker.mines) {
        const building =
            BigInt(appState.current.drillingMines) -
            (BigInt(playerState.mines) - BigInt(appState.current.cookieBaker.mines));
        if (BigInt(building) < 0n) dispatch(updateDrillingMines(0n));
        else dispatch(updateDrillingMines(building));
    }
    if (playerState.factories > appState.current.cookieBaker.factories) {
        const building =
            BigInt(appState.current.buildingFactories) -
            (BigInt(playerState.factories) - BigInt(appState.current.cookieBaker.factories));
        if (BigInt(building) < 0n) dispatch(updateBuildingFactories(0n));
        else dispatch(updateBuildingFactories(building));
    }
    if (playerState.banks > appState.current.cookieBaker.banks) {
        const building =
            BigInt(appState.current.buildingBanks) -
            (BigInt(playerState.banks) - BigInt(appState.current.cookieBaker.banks));
        if (BigInt(building) < 0n) dispatch(updateBuildingBanks(0n));
        else dispatch(updateBuildingBanks(building));
    }
    if (playerState.temples > appState.current.cookieBaker.temples) {
        const building =
            BigInt(appState.current.buildingTemples) -
            (BigInt(playerState.temples) - BigInt(appState.current.cookieBaker.temples));
        if (BigInt(building) < 0n) dispatch(updateBuildingTemples(0n));
        else dispatch(updateBuildingTemples(building));
    }
}

export const resetPendings = (dispatch: React.Dispatch<action>) => {
    dispatch(updateOven(0n));
    dispatch(updateCursorBasket(0n));
    dispatch(updateRecruitingGrandmas(0n));
    dispatch(updateBuildingFarms(0n));
    dispatch(updateDrillingMines(0n));
    dispatch(updateBuildingFactories(0n));
    dispatch(updateBuildingBanks(0n));
    dispatch(updateBuildingTemples(0n));
}