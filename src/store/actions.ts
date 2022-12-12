import * as React from 'react'
import { cookieBaker } from './cookieBaker'

import { BeaconWallet } from "@taquito/beacon-wallet";
import { getActualPlayerState, getLeaderBoard, mint } from './vmApi';
import { keyPair, state } from './reducer';
import { Contract } from '@marigold-dev/deku';
import { cursor } from './vmActions/cursor';
import { cookie } from './vmActions/cookie';
import { grandma } from './vmActions/grandma';
import { farm } from './vmActions/farm';
import { mine } from './vmActions/mine';
import { factory } from './vmActions/factory';
import { bank } from './vmActions/bank';
import { temple } from './vmActions/temple';
import { eat } from './vmActions/eat';
import { transfer } from './vmActions/transfer';
import { leaderBoard } from './utils';

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
type updateBuildingBanks = {
    type: "UPDATE_BUILDING_BANKS",
    payload: bigint
}
type updateBuildingTemples = {
    type: "UPDATE_BUILDING_TEMPLES",
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
type saveContract = {
    type: "SAVE_CONTRACT",
    payload: Contract
}
type saveConfig = {
    type: "SAVE_CONFIG",
    nodeUri: string,
    nickName: string
}
type eraseConfig = {
    type: "ERASE_CONFIG"
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
export type action = fullUpdateCB | saveWallet | saveConfig | addError | clearError | addMessage | clearMessage | saveGeneratedKeyPair | saveLeaderBoard | saveUserAddress | updateOven | updateCursorBasket | updateRecruitingGrandmas | updateBuildingFarms | updateDrillingMines | updateBuildingFactories | updateBuildingBanks | updateBuildingTemples | saveContract | eraseConfig

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
export const updateBuildingBanks = (payload: bigint): action => ({
    type: "UPDATE_BUILDING_BANKS",
    payload
});
export const updateBuildingTemples = (payload: bigint): action => ({
    type: "UPDATE_BUILDING_TEMPLES",
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

export const saveContract = (payload: Contract): action => ({
    type: "SAVE_CONTRACT",
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

export const eraseConfig = (): action => ({
    type: "ERASE_CONFIG"
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

const add = (type: any) => async (dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>): Promise<void> => {
    try {
        const vmAction = type; // ¯\_(ツ)_/¯ Why not sharing the same action semantic
        const wallet = state.current.wallet;
        const nodeUri = state.current.nodeUri;
        if (!wallet || !nodeUri) {
            throw new Error("Wallet must be saved before minting");
        }
        mint(vmAction, state);
    } catch (err) {
        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
    }
}

export const addCookie = (amount: string,
    dispatch: React.Dispatch<action>,
    state: React.MutableRefObject<state>) =>
    add(cookie(amount))
        (dispatch, state);

export const addCursor = add(cursor);

export const addGrandma = add(grandma);

export const addFarm = add(farm);

export const addMine = add(mine);

export const addFactory = add(factory);

export const addBank = add(bank);

export const addTemple = add(temple);

export const transferCookie = (to: string,
    amount: string,
    dispatch: React.Dispatch<action>,
    state: React.MutableRefObject<state>,
    payload: number = 1) => {
    add(transfer(amount, to))
        (dispatch, state);
}

export const eatCookie = (amount: string,
    dispatch: React.Dispatch<action>,
    state: React.MutableRefObject<state>,
    payload: number = 1) =>
    add(eat(amount))
        (dispatch, state);

export const initState = async (dispatch: React.Dispatch<action>, nodeUri: string, keyPair: keyPair | null, state: React.MutableRefObject<state>) => {
    const contract = state.current.dekucContract;
    if (contract) {
        try {
            const playerState = await getActualPlayerState(dispatch, state);
            dispatch(fullUpdateCB(playerState));
            const vmState = await contract.getState();
            const leaderBoard = getLeaderBoard(vmState);
            dispatch(saveLeaderBoard(leaderBoard));
        } catch (err) {
            const error_msg = (typeof err === 'string') ? err : (err as Error).message;
            dispatch(addError(error_msg));
            throw new Error(error_msg);
        }
    }
}
