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
    banks: bigint,
    temples: bigint,
    cursorCost: bigint,
    grandmaCost: bigint,
    farmCost: bigint,
    mineCost: bigint,
    factoryCost: bigint,
    bankCost: bigint,
    templeCost: bigint,
    passiveCPS: bigint,
    eatenCookies: bigint,
    layerOneAddress: string
};

export const initialState: cookieBaker = {
    cookies: 0n,
    cursors: 0n,
    grandmas: 0n,
    farms: 0n,
    mines: 0n,
    factories: 0n,
    banks: 0n,
    temples: 0n,
    cursorCost: 0n,
    grandmaCost: 0n,
    farmCost: 0n,
    mineCost: 0n,
    factoryCost: 0n,
    bankCost: 0n,
    templeCost: 0n,
    passiveCPS: 0n,
    eatenCookies: 0n,
    layerOneAddress: ""
}

// useful to determine if button is disabled or not
export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"
export const buyMine = "buy_mine"
export const buyFactory = "buy_factory"
export const buyBank = "buy_bank"
export const buyTemple = "buy_temple"

/**
 * Determine if a button is enabled based on the provided state
 * @param state 
 * @param button 
 * @returns 
 */
export const isButtonEnabled = (state: state, button: string): boolean => {
    switch (button) {
        case "buy_cursor": {
            let clonflictWithGrandmas = state.recruitingGrandmas === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.cursorCost + state.cookieBaker.grandmaCost))
            let clonflictWithFarms = state.buildingFarms === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.cursorCost + state.cookieBaker.farmCost))
            let clonflictWithMines = state.drillingMines === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.cursorCost + state.cookieBaker.mineCost))
            let clonflictWithFactories = state.buildingFactories === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.cursorCost + state.cookieBaker.factoryCost))
            let clonflictWithBanks = state.buildingBanks === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.cursorCost + state.cookieBaker.bankCost))
            let clonflictWithTemples = state.buildingTemples === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.cursorCost + state.cookieBaker.templeCost))
            return (state.cookieBaker.cursorCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.cursorsInBasket === 0n
                && !clonflictWithGrandmas
                && !clonflictWithFarms
                && !clonflictWithMines
                && !clonflictWithFactories
                && !clonflictWithBanks
                && !clonflictWithTemples);
        }
        case "buy_grandma": {
            let clonflictWithCursors = state.cursorsInBasket === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.grandmaCost + state.cookieBaker.cursorCost))
            let clonflictWithFarms = state.buildingFarms === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.grandmaCost + state.cookieBaker.farmCost))
            let clonflictWithMines = state.drillingMines === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.grandmaCost + state.cookieBaker.mineCost))
            let clonflictWithFactories = state.buildingFactories === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.grandmaCost + state.cookieBaker.factoryCost))
            let clonflictWithBanks = state.buildingBanks === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.grandmaCost + state.cookieBaker.bankCost))
            let clonflictWithTemples = state.buildingTemples === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.grandmaCost + state.cookieBaker.templeCost))
            return (state.cookieBaker.grandmaCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.recruitingGrandmas === 0n
                && !clonflictWithCursors
                && !clonflictWithFarms
                && !clonflictWithMines
                && !clonflictWithFactories
                && !clonflictWithBanks
                && !clonflictWithTemples);
        }
        case "buy_farm": {
            let clonflictWithCursors = state.cursorsInBasket === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.farmCost + state.cookieBaker.cursorCost))
            let clonflictWithGrandmas = state.recruitingGrandmas === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.farmCost + state.cookieBaker.grandmaCost))
            let clonflictWithMines = state.drillingMines === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.farmCost + state.cookieBaker.mineCost))
            let clonflictWithFactories = state.buildingFactories === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.farmCost + state.cookieBaker.factoryCost))
            let clonflictWithBanks = state.buildingBanks === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.farmCost + state.cookieBaker.bankCost))
            let clonflictWithTemples = state.buildingTemples === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.farmCost + state.cookieBaker.templeCost))
            return (state.cookieBaker.farmCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.buildingFarms === 0n
                && !clonflictWithCursors
                && !clonflictWithGrandmas
                && !clonflictWithMines
                && !clonflictWithFactories
                && !clonflictWithBanks
                && !clonflictWithTemples);
        }
        case "buy_mine": {
            let clonflictWithCursors = state.cursorsInBasket === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.mineCost + state.cookieBaker.cursorCost))
            let clonflictWithGrandmas = state.recruitingGrandmas === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.mineCost + state.cookieBaker.grandmaCost))
            let clonflictWithFarms = state.buildingFarms === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.mineCost + state.cookieBaker.farmCost))
            let clonflictWithFactories = state.buildingFactories === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.mineCost + state.cookieBaker.factoryCost))
            let clonflictWithBanks = state.buildingBanks === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.mineCost + state.cookieBaker.bankCost))
            let clonflictWithTemples = state.buildingTemples === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.mineCost + state.cookieBaker.templeCost))
            return (state.cookieBaker.mineCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.drillingMines === 0n
                && !clonflictWithCursors
                && !clonflictWithGrandmas
                && !clonflictWithFarms
                && !clonflictWithFactories
                && !clonflictWithBanks
                && !clonflictWithTemples);
        }
        case "buy_factory": {
            let clonflictWithCursors = state.cursorsInBasket === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.factoryCost + state.cookieBaker.cursorCost))
            let clonflictWithGrandmas = state.recruitingGrandmas === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.factoryCost + state.cookieBaker.grandmaCost))
            let clonflictWithFarms = state.buildingFarms === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.factoryCost + state.cookieBaker.farmCost))
            let clonflictWithMines = state.drillingMines === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.factoryCost + state.cookieBaker.mineCost))
            let clonflictWithBanks = state.buildingBanks === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.factoryCost + state.cookieBaker.bankCost))
            let clonflictWithTemples = state.buildingTemples === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.factoryCost + state.cookieBaker.templeCost))
            return (state.cookieBaker.factoryCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.buildingFactories === 0n
                && !clonflictWithCursors
                && !clonflictWithGrandmas
                && !clonflictWithFarms
                && !clonflictWithMines
                && !clonflictWithBanks
                && !clonflictWithTemples);
        }
        case "buy_bank": {
            let clonflictWithCursors = state.cursorsInBasket === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.bankCost + state.cookieBaker.cursorCost))
            let clonflictWithGrandmas = state.recruitingGrandmas === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.bankCost + state.cookieBaker.grandmaCost))
            let clonflictWithFarms = state.buildingFarms === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.bankCost + state.cookieBaker.farmCost))
            let clonflictWithMines = state.drillingMines === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.bankCost + state.cookieBaker.mineCost))
            let clonflictWithFactories = state.buildingFactories === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.bankCost + state.cookieBaker.factoryCost))
            let clonflictWithTemples = state.buildingTemples === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.bankCost + state.cookieBaker.templeCost))
            return (state.cookieBaker.bankCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.buildingBanks === 0n
                && !clonflictWithCursors
                && !clonflictWithGrandmas
                && !clonflictWithFarms
                && !clonflictWithMines
                && !clonflictWithFactories
                && !clonflictWithTemples);
        }
        case "buy_temple": {
            let clonflictWithCursors = state.cursorsInBasket === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.templeCost + state.cookieBaker.cursorCost))
            let clonflictWithGrandmas = state.recruitingGrandmas === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.templeCost + state.cookieBaker.grandmaCost))
            let clonflictWithFarms = state.buildingFarms === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.templeCost + state.cookieBaker.farmCost))
            let clonflictWithMines = state.drillingMines === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.templeCost + state.cookieBaker.mineCost))
            let clonflictWithFactories = state.buildingFactories === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.templeCost + state.cookieBaker.factoryCost))
            let clonflictWithBanks = state.buildingBanks === 1n
                && !(state.cookieBaker.cookies >= (state.cookieBaker.templeCost + state.cookieBaker.bankCost))
            return (state.cookieBaker.templeCost <= state.cookieBaker.cookies && state.cookieBaker.cookies > 0n && state.buildingTemples === 0n
                && !clonflictWithCursors
                && !clonflictWithGrandmas
                && !clonflictWithFarms
                && !clonflictWithMines
                && !clonflictWithFactories
                && !clonflictWithBanks);
        }
    }
    return true;
}

export const displayInfo = (state: state, div: string): string => {
    switch (div) {
        case "buy_cursor": {
            if (state.cursorsInBasket > 0)
                return "Block waiting to be included";
            else break;
        }
        case "buy_grandma": {
            if (state.recruitingGrandmas > 0)
                return "Block waiting to be included";
            else break;
        }
        case "buy_farm": {
            if (state.buildingFarms > 0)
                return "Block waiting to be included";
            else break;
        }
        case "buy_mine": {
            if (state.drillingMines > 0)
                return "Block waiting to be included";
            else break;
        }
        case "buy_factory": {
            if (state.buildingFactories > 0)
                return "Block waiting to be included";
            else break;
        }
        case "buy_bank": {
            if (state.buildingBanks > 0)
                return "Block waiting to be included";
            else break;
        }
        case "buy_temple": {
            if (state.buildingTemples > 0)
                return "Block waiting to be included";
            else break;
        }

    }
    return ""
}