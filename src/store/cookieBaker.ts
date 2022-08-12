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
    freeCursor: bigint,
    freeGrandma: bigint,
    freeFarm: bigint,
    cursorCost: bigint,
    grandmaCost: bigint,
    farmCost: bigint,
    cursorCps: number,
    grandmaCps: bigint,
    farmCps: bigint
};

export const initialState: cookieBaker = {
    cookies: 0n,
    cursors: 0n,
    grandmas: 0n,
    farms: 0n,
    freeCursor: 0n,
    freeGrandma: 0n,
    freeFarm: 0n,
    cursorCost: 0n,
    grandmaCost: 0n,
    farmCost: 0n,
    cursorCps: 0,
    grandmaCps: 0n,
    farmCps: 0n
}

/**
 * Calculate the total Cookie Per Second of the provided state
 * @param state 
 * @returns 
 */
export const getTotalCps = (state: cookieBaker): number => {
    return state.cursorCps + Number(state.grandmaCps) + Number(state.farmCps);
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
    }
    return true;
}