import { BeaconWallet } from "@taquito/beacon-wallet";

/**
 * State type
 * Must be a subset of the cookieBaker defined in Deku
 */
//TODO: use the deku cookieBaker?
export type cookieBaker = {
    cookies: bigint,
    cursors: bigint,
    grandmas: bigint,
    farms: bigint,
    mines: bigint,
    freeCursor: bigint,
    freeGrandma: bigint,
    freeFarm: bigint,
    freeMine: bigint,
    cursorCost: bigint,
    grandmaCost: bigint,
    farmCost: bigint,
    mineCost: bigint,
    cursorCps: number,
    grandmaCps: bigint,
    farmCps: bigint,
    mineCps: bigint,
    address: string | null,
    wallet: BeaconWallet | null
};

export const initialState: cookieBaker = {
    cookies: 0n,
    cursors: 0n,
    grandmas: 0n,
    farms: 0n,
    mines: 0n,
    freeCursor: 0n,
    freeGrandma: 0n,
    freeFarm: 0n,
    freeMine: 0n,
    cursorCost: 0n,
    grandmaCost: 0n,
    farmCost: 0n,
    mineCost: 0n,
    cursorCps: 0,
    grandmaCps: 0n,
    farmCps: 0n,
    mineCps: 0n,
    address: null,
    wallet: null
}

/**
 * Calculate the total Cookie Per Second of the provided state
 * @param state 
 * @returns 
 */
export const getTotalCps = (state: cookieBaker): number => {
    return state.cursorCps + Number(state.grandmaCps) + Number(state.farmCps) + Number(state.mineCps);
}

/**
 * Determine id a button is enabled based on the provided state
 * @param state 
 * @param button 
 * @returns 
 */
export const isButtonEnabled = (state: cookieBaker, button: string): boolean => {
    switch (button) {
        case "buy_cursor": {
            return (state.cursorCost <= state.cookies);
        }
        case "buy_grandma": {
            return (state.grandmaCost <= state.cookies);
        }
        case "buy_farm": {
            return (state.farmCost <= state.cookies);
        }
        case "buy_mine": {
            return (state.mineCost <= state.cookies);
        }
    }
    return true;
}