import * as React from 'react'
import { cookieBaker } from './cookieBaker'

import { BeaconWallet } from "@taquito/beacon-wallet";
import { getActualPlayerState, getLeaderBoard, mint } from './vmApi';
import { keyPair, state } from './reducer';
import { vmOperation } from './vmTypes';
import { Contract } from '@marigold-dev/deku-c-toolkit';
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
import { getPlayerState, leaderBoard } from './utils';

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
type saveGeneratedKeyPair = {
    type: "SAVE_GENERATED_KEY_PAIR",
    payload: keyPair
}
type saveUserAddress = {
    type: "SAVE_PUBLIC_ADDRESS",
    payload: string
}

// ACTIONS
export type action = fullUpdateCB | saveWallet | saveConfig | addError | clearError | addMessage | clearMessage | saveGeneratedKeyPair | saveLeaderBoard | saveUserAddress | updateOven | updateCursorBasket | updateRecruitingGrandmas | updateBuildingFarms | updateDrillingMines | updateBuildingFactories | updateBuildingBanks | updateBuildingTemples | saveContract

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
        const userAddress = state.current.publicAddress;
        if (!wallet || !nodeUri) {
            throw new Error("Wallet must be saved before minting");
        }
        mint(vmAction, state);
        if (userAddress && state.current.dekucContract) {
            state.current.dekucContract.onNewState((newState: any) => {
                const playerState = getPlayerState(newState, userAddress);
                if (playerState.cookies > state.current.cookieBaker.cookies) {
                    const inOven =
                        BigInt(state.current.cookiesInOven) -
                        (BigInt(playerState.cookies) - BigInt(state.current.cookieBaker.cookies));
                    if (BigInt(inOven) < 0n) dispatch(updateOven(0n));
                    else dispatch(updateOven(inOven));
                }
                if (playerState.cursors > state.current.cookieBaker.cursors) {
                    const building =
                        BigInt(state.current.cursorsInBasket) -
                        (BigInt(playerState.cursors) - BigInt(state.current.cookieBaker.cursors));
                    if (BigInt(building) < 0n) dispatch(updateCursorBasket(0n));
                    else dispatch(updateCursorBasket(building));
                }
                // TODO: this is duplicated logic from cursor in basket etc. Abstract into a function
                if (playerState.grandmas > state.current.cookieBaker.grandmas) {
                    const building =
                        BigInt(state.current.recruitingGrandmas) -
                        (BigInt(playerState.grandmas) - BigInt(state.current.cookieBaker.grandmas));
                    if (BigInt(building) < 0n) dispatch(updateRecruitingGrandmas(0n));
                    else dispatch(updateRecruitingGrandmas(building));
                }
                if (playerState.farms > state.current.cookieBaker.farms) {
                    const building =
                        BigInt(state.current.buildingFarms) -
                        (BigInt(playerState.farms) - BigInt(state.current.cookieBaker.farms));
                    if (BigInt(building) < 0n) dispatch(updateBuildingFarms(0n));
                    else dispatch(updateBuildingFarms(building));
                }
                if (playerState.mines > state.current.cookieBaker.mines) {
                    const building =
                        BigInt(state.current.drillingMines) -
                        (BigInt(playerState.mines) - BigInt(state.current.cookieBaker.mines));
                    if (BigInt(building) < 0n) dispatch(updateDrillingMines(0n));
                    else dispatch(updateDrillingMines(building));
                }
                if (playerState.factories > state.current.cookieBaker.factories) {
                    const building =
                        BigInt(state.current.buildingFactories) -
                        (BigInt(playerState.factories) - BigInt(state.current.cookieBaker.factories));
                    if (BigInt(building) < 0n) dispatch(updateBuildingFactories(0n));
                    else dispatch(updateBuildingFactories(building));
                }
                if (playerState.banks > state.current.cookieBaker.banks) {
                    const building =
                        BigInt(state.current.buildingBanks) -
                        (BigInt(playerState.banks) - BigInt(state.current.cookieBaker.banks));
                    if (BigInt(building) < 0n) dispatch(updateBuildingBanks(0n));
                    else dispatch(updateBuildingBanks(building));
                }
                if (playerState.temples > state.current.cookieBaker.temples) {
                    const building =
                        BigInt(state.current.buildingTemples) -
                        (BigInt(playerState.temples) - BigInt(state.current.cookieBaker.temples));
                    if (BigInt(building) < 0n) dispatch(updateBuildingTemples(0n));
                    else dispatch(updateBuildingTemples(building));
                }
                dispatch(fullUpdateCB(playerState));
                const leaderBoard = getLeaderBoard(newState);
                dispatch(saveLeaderBoard(leaderBoard));
            })
        }
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
        const userAddress = state.current.publicAddress;
        if (!wallet || !nodeUri) {
            throw new Error("Wallet must be saved before minting");
        }
        Array(payload).fill(1).map(() => mint(vmAction, state));
        if (userAddress && state.current.dekucContract)
            state.current.dekucContract.onNewState((newState: any) => {
                const playerState = getPlayerState(newState, userAddress);
                dispatch(fullUpdateCB(playerState));
                const leaderBoard = getLeaderBoard(newState);
                dispatch(saveLeaderBoard(leaderBoard));
            })

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
