import * as React from 'react'
import { cookieBaker, getTotalCps } from './cookieBaker'

import { BeaconWallet } from "@taquito/beacon-wallet";
import { getActualState, mint } from './vmApi';
import { state } from './reducer';
import { InMemorySigner } from '@taquito/signer';
/**
 * All the actions available
 */
type fullUpdateCB = {
    type: "FULL_UPDATE_COOKIE_BAKER",
    payload: cookieBaker
}
type addError = {
    type: "ADD_ERROR",
    payload: string
}
type clearError = {
    type: "CLEAR_ERROR"
}
type saveWallet = {
    type: "SAVE_WALLET",
    payload: InMemorySigner | BeaconWallet | null
}
type saveAddress = {
    type: "SAVE_ADDRESS",
    payload: string | null
}
type saveNodeUri = {
    type: "SAVE_NODE_URI",
    payload: string
}

// ACTIONS
export type action = fullUpdateCB | saveWallet | saveAddress | saveNodeUri | addError | clearError

// ACTION CREATORS
export const fullUpdateCB = (payload: cookieBaker): action => ({
    type: "FULL_UPDATE_COOKIE_BAKER",
    payload
});
export const saveWallet = (payload: InMemorySigner | BeaconWallet | null): action => ({
    type: "SAVE_WALLET",
    payload
});

export const saveAddress = (payload: string | null): action => ({
    type: "SAVE_ADDRESS",
    payload
});
export const saveNodeUri = (payload: string): action => ({
    type: "SAVE_NODE_URI",
    payload
});
export const addError = (payload: string): action => ({
    type: "ADD_ERROR",
    payload
});
export const clearError = (): action => ({
    type: "CLEAR_ERROR"
});

const add = (type: "ADD_COOKIE" | "ADD_CURSOR" | "ADD_GRANDMA" | "ADD_FARM" | "ADD_MINE") => async (dispatch: React.Dispatch<action>, getState: (() => state), payload: number = 1): Promise<void> => {
    try {
        const vmAction = type.split("_")[1].toLowerCase(); // ¯\_(ツ)_/¯ Why not sharing the same action semantic
        const signer = getState().wallet;
        if (!signer) {
            throw new Error("Wallet must be saved before minting");
        }
        if (signer instanceof BeaconWallet) {
            throw new Error("BeaconWallet is not yet supported");
        }
        const actions: Array<Promise<string>> = Array(payload).map(() => mint(vmAction, signer));
        const ophash = await Promise.all(actions);
        console.debug(`New operations submitted to VM: ${ophash}`);
        //TODO: replace timeout by checking that ophash is included and then waiting for 2 blocks
        setTimeout(async (): Promise<void> => {
            const vmState = await getActualState();
            dispatch(fullUpdateCB(vmState));
        }, 2000);
    } catch (err) {
        console.error(err);
        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw err;
    }
}

export const addCookie = add("ADD_COOKIE");
export const addCursor = add("ADD_CURSOR");
export const addGrandma = add("ADD_GRANDMA");
export const addFarm = add("ADD_FARM");
export const addMine = add("ADD_MINE");

export const initState = async (dispatch: React.Dispatch<action>) => {
    const vmState = await getActualState();
    dispatch(fullUpdateCB(vmState));
}
export const startBakery = (dispatch: React.Dispatch<action>, getState: (() => state)) => {
    return setInterval(() => {
        const cb = getState().cookieBaker;
        const production = getTotalCps(cb);
        addCookie(dispatch, getState, production)
    }, 1000)
}