import * as React from 'react'
import { cookieBaker } from './cookieBaker'

import { BeaconWallet } from "@taquito/beacon-wallet";
import { getActualPlayerState, getLeaderBoard, mint } from './vmApi';
import { keyPair, state } from './reducer';
import { building, leaderBoard, operationType, vmOperation } from './vmTypes';

/**
 * All the actions available
 */
type fullUpdateCB = {
    type: "FULL_UPDATE_COOKIE_BAKER",
    payload: cookieBaker
}
type updateOven = {
    type: "UPDATE_COOKIES_IN_OVEN",
    payload: bigint
}
type updateCursorBasket = {
    type: "UPDATE_CURSORS_IN_BASKET",
    payload: bigint
}
type updateRecruitingGrandmas = {
    type: "UPDATE_RECRUITING_GRANDMAS",
    payload: bigint
}
type updateBuildingFarms = {
    type: "UPDATE_BUILDING_FARMS",
    payload: bigint
}
type updateDrillingMines = {
    type: "UPDATE_DRILLING_MINES",
    payload: bigint
}
type updateBuildingFactories = {
    type: "UPDATE_BUILDING_FACTORIES",
    payload: bigint
}
type saveLeaderBoard = {
    type: "SAVE_LEADERBOARD",
    payload: leaderBoard[]
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
type saveUserAddress = {
    type: "SAVE_PUBLIC_ADDRESS",
    payload: string
}

// ACTIONS
export type action = fullUpdateCB | saveWallet | saveConfig | addError | clearError | addMessage | clearMessage | saveGeneratedKeyPair | saveLeaderBoard | saveUserAddress | updateOven | updateCursorBasket | updateRecruitingGrandmas | updateBuildingFarms | updateDrillingMines | updateBuildingFactories

// ACTION CREATORS
export const fullUpdateCB = (payload: cookieBaker): action => ({
    type: "FULL_UPDATE_COOKIE_BAKER",
    payload
});

export const updateOven = (payload: bigint): action => ({
    type: "UPDATE_COOKIES_IN_OVEN",
    payload
});

export const updateCursorBasket = (payload: bigint): action => ({
    type: "UPDATE_CURSORS_IN_BASKET",
    payload
});
export const updateRecruitingGrandmas = (payload: bigint): action => ({
    type: "UPDATE_RECRUITING_GRANDMAS",
    payload
});
export const updateBuildingFarms = (payload: bigint): action => ({
    type: "UPDATE_BUILDING_FARMS",
    payload
});
export const updateDrillingMines = (payload: bigint): action => ({
    type: "UPDATE_DRILLING_MINES",
    payload
});
export const updateBuildingFactories = (payload: bigint): action => ({
    type: "UPDATE_BUILDING_FACTORIES",
    payload
});

export const saveLeaderBoard = (payload: leaderBoard[]): action => ({
    type: "SAVE_LEADERBOARD",
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

export const saveUserAddress = (payload: string): action => ({
    type: "SAVE_PUBLIC_ADDRESS",
    payload
});

const add = (type: vmOperation) => async (dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>, payload: number = 1): Promise<void> => {
    try {
        const vmAction = type; // ¯\_(ツ)_/¯ Why not sharing the same action semantic
        const wallet = state.current.wallet;
        const nodeUri = state.current.nodeUri;
        if (!wallet || !nodeUri) {
            throw new Error("Wallet must be saved before minting");
        }
        Array(payload).fill(1).map(() => mint(vmAction, nodeUri, state, dispatch));
        //TODO: replace timeout by checking that ophash is included and then waiting for 2 blocks
        setTimeout(async (): Promise<void> => {
            const vmState = await getActualPlayerState(dispatch, nodeUri, state.current.generatedKeyPair);
            if ((vmState.cookies > state.current.cookieBaker.cookies)) {
                const inOven = state.current.cookiesInOven - (vmState.cookies - state.current.cookieBaker.cookies);
                if (inOven < 0n)
                    dispatch(updateOven(0n));
                else
                    dispatch(updateOven(inOven));
            }
            if ((vmState.cursors > state.current.cookieBaker.cursors)) {
                const building = state.current.cursorsInBasket - (vmState.cursors - state.current.cookieBaker.cursors);
                if (building < 0n)
                    dispatch(updateCursorBasket(0n));
                else
                    dispatch(updateCursorBasket(building));
            }
            dispatch(fullUpdateCB(vmState));
            const leaderBoard = await getLeaderBoard(nodeUri);
            dispatch(saveLeaderBoard(leaderBoard));
        }, 3000);
    } catch (err) {
        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
    }
}

export const transferOrEatCookies = async (type: vmOperation, dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>, payload: number = 1): Promise<void> => {
    try {
        const vmAction = type;
        const wallet = state.current.wallet;
        const nodeUri = state.current.nodeUri;
        if (!wallet || !nodeUri) {
            throw new Error("Wallet must be saved before minting");
        }
        Array(payload).fill(1).map(() => mint(vmAction, nodeUri, state, dispatch));
        //TODO: replace timeout by checking that ophash is included and then waiting for 2 blocks
        setTimeout(async (): Promise<void> => {
            const vmState = await getActualPlayerState(dispatch, nodeUri, state.current.generatedKeyPair);
            dispatch(fullUpdateCB(vmState));
            const leaderBoard = await getLeaderBoard(nodeUri);
            dispatch(saveLeaderBoard(leaderBoard));
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
export const transferCookie = (to: string, amount: string, dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>, payload: number = 1) => add({ type: operationType.transfer, operation: { to, amount } })(dispatch, state, payload);
export const eatCookie = (amount: string, dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>, payload: number = 1) => add({ type: operationType.eat, operation: { amount } })(dispatch, state, payload);

export const initState = async (dispatch: React.Dispatch<action>, nodeUri: string, keyPair: keyPair | null) => {
    try {
        const vmState = await getActualPlayerState(dispatch, nodeUri, keyPair);
        dispatch(fullUpdateCB(vmState));
        const leaderBoard = await getLeaderBoard(nodeUri);
        dispatch(saveLeaderBoard(leaderBoard));
    } catch (err) {
        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
    }
}
