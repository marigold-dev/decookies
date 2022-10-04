import { state } from './reducer';

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
    eatenCookies: bigint
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
    mineCost: 0n,
    factoryCost: 0n,
    passiveCPS: 0n,
    eatenCookies: 0n
}

// useful to determine if button is disabled or not
export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"
export const buyMine = "buy_mine"
export const buyFactory = "buy_factory"

/**
 * Determine if a button is enabled based on the provided state
 * @param state 
 * @param button 
 * @returns 
 */
export const isButtonEnabled = (state: state, button: string): boolean => {
    switch (button) {
        case "buy_cursor": {
            return (state.cookieBaker.cursorCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.cursorsInBasket === 0n);
        }
        case "buy_grandma": {
            return (state.cookieBaker.grandmaCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.recruitingGrandmas === 0n);
        }
        case "buy_farm": {
            return (state.cookieBaker.farmCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.buildingFarms === 0n);
        }
        case "buy_mine": {
            return (state.cookieBaker.mineCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.drillingMines === 0n);
        }
        case "buy_factory": {
            return (state.cookieBaker.factoryCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.buildingFactories === 0n);
        }
    }
    return true;
}