import * as React from 'react'
import { cookieBaker } from './cookieBaker'

import { BeaconWallet } from "@taquito/beacon-wallet";
import { getActualState, getLeaderBoard, mint } from './vmApi';
import { keyPair, state } from './reducer';
import { building, operationType, vmOperation } from './vmTypes';

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
type addMessage = {
    type: "ADD_MESSAGE",
    payload: string
}
type clearMessage = {
    type: "CLEAR_MESSAGE"
}
type saveWallet = {
    type: "SAVE_WALLET",
    payload: BeaconWallet | null
}
type saveConfig = {
    type: "SAVE_CONFIG",
    nodeUri: string,
    nickName: string
}
type saveGeneratedKeyPair = {
    type: "SAVE_GENERATED_KEY_PAIR",
    payload: keyPair
}

// ACTIONS
export type action = fullUpdateCB | saveWallet | saveConfig | addError | clearError | addMessage | clearMessage | saveGeneratedKeyPair

// ACTION CREATORS
export const fullUpdateCB = (payload: cookieBaker): action => ({
    type: "FULL_UPDATE_COOKIE_BAKER",
    payload
});

export const saveWallet = (payload: BeaconWallet | null): action => ({
    type: "SAVE_WALLET",
    payload
});

export const saveGeneratedKeyPair = (payload: keyPair): action => ({
    type: "SAVE_GENERATED_KEY_PAIR",
    payload
});

export const saveConfig = (nodeUri: string, nickName: string): action => ({
    type: "SAVE_CONFIG",
    nodeUri,
    nickName
});

export const addError = (payload: string): action => ({
    type: "ADD_ERROR",
    payload
});

export const clearError = (): action => ({
    type: "CLEAR_ERROR"
});

export const addMessage = (payload: string): action => ({
    type: "ADD_MESSAGE",
    payload
});

export const clearMessage = (): action => ({
    type: "CLEAR_MESSAGE"
});

const add = (type: vmOperation) => async (dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>, payload: number = 1): Promise<void> => {
    try {
        const vmAction = type; // ¯\_(ツ)_/¯ Why not sharing the same action semantic
        const wallet = state.current.wallet;
        const nodeUri = state.current.nodeUri;
        if (!wallet || !nodeUri) {
            throw new Error("Wallet must be saved before minting");
        }
        Array(payload).fill(1).map(() => mint(vmAction, nodeUri, state.current.generatedKeyPair));
        getLeaderBoard(nodeUri);
        //TODO: replace timeout by checking that ophash is included and then waiting for 2 blocks
        setTimeout(async (): Promise<void> => {
            const vmState = await getActualState(nodeUri, state.current.generatedKeyPair);
            dispatch(fullUpdateCB(vmState));
        }, 2000);
    } catch (err) {
        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
    }
}

export const transferCookies = async (type: vmOperation, dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>, payload: number = 1): Promise<void> => {
    console.log("start transfering");
    try {
        const vmAction = type; // ¯\_(ツ)_/¯ Why not sharing the same action semantic
        const wallet = state.current.wallet;
        const nodeUri = state.current.nodeUri;
        if (!wallet || !nodeUri) {
            throw new Error("Wallet must be saved before minting");
        }
        Array(payload).fill(1).map(() => mint(vmAction, nodeUri, state.current.generatedKeyPair));
        //TODO: replace timeout by checking that ophash is included and then waiting for 2 blocks
        setTimeout(async (): Promise<void> => {
            const vmState = await getActualState(nodeUri, state.current.generatedKeyPair);
            dispatch(fullUpdateCB(vmState));
        }, 2000);
    } catch (err) {
        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
    }
}

export const addCookie = add({ type: operationType.mint, operation: building.cookie });
export const addCursor = add({ type: operationType.mint, operation: building.cursor });
export const addGrandma = add({ type: operationType.mint, operation: building.grandma });
export const addFarm = add({ type: operationType.mint, operation: building.farm });
export const addMine = add({ type: operationType.mint, operation: building.mine });
export const addFactory = add({ type: operationType.mint, operation: building.factory });

export const initState = async (dispatch: React.Dispatch<action>, nodeUri: string, keyPair: keyPair | null) => {
    try {
        const vmState = await getActualState(nodeUri, keyPair);
        dispatch(fullUpdateCB(vmState));
    } catch (err) {
        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
    }
}
