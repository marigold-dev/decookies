import { action } from './actions';
import { BeaconWallet } from "@taquito/beacon-wallet";
import { cookieBaker, initialState as backeryInitialState } from './cookieBaker';
import { Contract } from '@marigold-dev/deku';
import { leaderBoard } from './utils';

export type state = {
    error: string | null,
    message: string | null,
    wallet: BeaconWallet | null,
    nodeUri: string | null, // TODO: improve with a type URI
    nickName: string | null, // TODO: improve with a type URI
    cookieBaker: cookieBaker,
    generatedKeyPair: keyPair | null,
    recipient: string | null,
    amount: string | null,
    leaderBoard: leaderBoard[],
    publicAddress: string | null,
    cookiesInOven: bigint,
    cursorsInBasket: bigint,
    recruitingGrandmas: bigint,
    buildingFarms: bigint,
    drillingMines: bigint,
    buildingFactories: bigint,
    buildingBanks: bigint,
    buildingTemples: bigint,
    dekucContract: Contract | null
    intervalId: NodeJS.Timer | null
}

export const initialState: state = {
    error: null,
    message: null,
    wallet: null,
    nodeUri: null,
    nickName: null,
    cookieBaker: backeryInitialState,
    generatedKeyPair: null,
    recipient: null,
    amount: null,
    leaderBoard: [],
    publicAddress: null,
    cookiesInOven: 0n,
    cursorsInBasket: 0n,
    recruitingGrandmas: 0n,
    buildingFarms: 0n,
    drillingMines: 0n,
    buildingFactories: 0n,
    buildingBanks: 0n,
    buildingTemples: 0n,
    dekucContract: null,
    intervalId: null
}

export type keyPair = {
    publicKey: string,
    privateKey: string
}

/**
 * Classic reducer, perform the related business regarding the received action
 * @param state 
 * @param action 
 * @returns state
 */
export const reducer = (state: state, action: action): state => {
    switch (action.type) {
        case "ADD_ERROR": {
            return { ...state, error: action.payload }
        }
        case "CLEAR_ERROR": {
            return { ...state, error: null }
        }
        case "ADD_MESSAGE": {
            return { ...state, message: action.payload }
        }
        case "CLEAR_MESSAGE": {
            return { ...state, message: null }
        }
        case "FULL_UPDATE_COOKIE_BAKER": {
            return { ...state, cookieBaker: action.payload }
        }
        case "SAVE_WALLET": {
            return { ...state, wallet: action.payload }
        }
        case "SAVE_CONFIG": {
            return { ...state, nodeUri: action.nodeUri, nickName: action.nickName }
        }
        case "SAVE_GENERATED_KEY_PAIR": {
            return { ...state, generatedKeyPair: action.payload }
        }
        case "SAVE_LEADERBOARD": {
            return { ...state, leaderBoard: action.payload }
        }
        case "SAVE_PUBLIC_ADDRESS": {
            return { ...state, publicAddress: action.payload }
        }
        case "UPDATE_COOKIES_IN_OVEN": {
            return { ...state, cookiesInOven: action.payload }
        }
        case "UPDATE_CURSORS_IN_BASKET": {
            return { ...state, cursorsInBasket: action.payload }
        }
        case "UPDATE_RECRUITING_GRANDMAS": {
            return { ...state, recruitingGrandmas: action.payload }
        }
        case "UPDATE_BUILDING_FARMS": {
            return { ...state, buildingFarms: action.payload }
        }
        case "UPDATE_DRILLING_MINES": {
            return { ...state, drillingMines: action.payload }
        }
        case "UPDATE_BUILDING_FACTORIES": {
            return { ...state, buildingFactories: action.payload }
        }
        case "UPDATE_BUILDING_BANKS": {
            return { ...state, buildingBanks: action.payload }
        }
        case "UPDATE_BUILDING_TEMPLES": {
            return { ...state, buildingTemples: action.payload }
        }
        case "SAVE_CONTRACT": {
            return { ...state, dekucContract: action.payload }
        }
        case "ERASE_CONFIG": {
            return { ...state, dekucContract: null, nodeUri: null, nickName: null, wallet: null, generatedKeyPair: null, leaderBoard: [], cookieBaker: backeryInitialState }
        }
    }
}
