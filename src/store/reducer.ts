import { action } from './actions';
import { BeaconWallet } from "@taquito/beacon-wallet";
import { cookieBaker, initialState as backeryInitialState } from './cookieBaker';
import { leaderBoard } from './vmTypes';

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
    leaderBoard: leaderBoard[]
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
    leaderBoard: []
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
    }
}
