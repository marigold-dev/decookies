/**
 * VM state type
 * Must be a subset of the cookieBaker defined in Deku
 */
//TODO: use the deku cookieBaker?
export type cookieBaker = {
    cookies: bigint,
    cursors: bigint,
    grandmas: bigint,
    farms: bigint,
    mines: bigint,
    factories: bigint,
    cursorCost: bigint,
    grandmaCost: bigint,
    farmCost: bigint,
    mineCost: bigint,
    factoryCost: bigint,
    passiveCPS: bigint
};

export const initialState: cookieBaker = {
    cookies: 0n,
    cursors: 0n,
    grandmas: 0n,
    farms: 0n,
    mines: 0n,
    factories: 0n,
    cursorCost: 0n,
    grandmaCost: 0n,
    farmCost: 0n,
    mineCost:0n,
    factoryCost:0n,
    passiveCPS: 0n
}

// useful to determine if button is disabled or not
export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"
export const buyMine = "buy_mine"
export const buyFactory = "buy_factory"

/**
 * Calculate the total Cookie Per Second of the provided state
 * @param state 
 * @returns 
 */
export const getTotalCps = (state: cookieBaker): bigint => {
    return state.passiveCPS;
}

/**
 * Determine if a button is enabled based on the provided state
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
        case "buy_factory": {
            return (state.factoryCost <= state.cookies);
        }
    }
    return true;
}