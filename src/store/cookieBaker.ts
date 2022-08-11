/**
 * State type
 * Must be a subset of the cookieBaker defined in Deku
 */
//TODO: use the deku cookieBaker?
export type cookieBaker = {
    cookies: number,
    cursors: number,
    grandmas: number,
    farms: number,
    freeCursor: number,
    freeGrandma: number,
    freeFarm: number,
    cursorCost: number,
    grandmaCost: number,
    farmCost: number,
    cursorCps: number,
    grandmaCps: number,
    farmCps: number
};

export const initialState: cookieBaker = {
    cookies: 0,
    cursors: 0.,
    grandmas: 0.,
    farms: 0.,
    freeCursor: 0,
    freeGrandma: 0,
    freeFarm: 0,
    cursorCost: 0,
    grandmaCost: 0,
    farmCost: 0,
    cursorCps: 0,
    grandmaCps: 0,
    farmCps: 0
}

/**
 * Calculate the total Cookie Per Second of the provided state
 * @param state 
 * @returns 
 */
export const getTotalCps = (state: cookieBaker): number => {
    return state.cursorCps + state.grandmaCps + state.farmCps;
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