import { action } from './actions';
import { BeaconWallet } from "@taquito/beacon-wallet";
import { cookieBaker, initialState as backeryInitialState } from './cookieBaker';

export type state = {
    error: string | null,
    wallet: BeaconWallet | null,
    nodeUri: string | null, // TODO: improve with a type URI
    cookieBaker: cookieBaker
}

export const initialState: state = {
    error: null,
    wallet: null,
    nodeUri: null,
    cookieBaker: backeryInitialState
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
        case "FULL_UPDATE_COOKIE_BAKER": {
            return { ...state, cookieBaker: action.payload }
        }
        case "SAVE_WALLET": {
            return { ...state, wallet: action.payload }
        }
        case "SAVE_NODE_URI": {
            return { ...state, nodeUri: action.payload }
        }
    }
}
