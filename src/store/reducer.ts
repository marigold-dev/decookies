import { action } from './actions';
import { InMemorySigner } from '@taquito/signer';
import { BeaconWallet } from "@taquito/beacon-wallet";
import { userAddress, nodeUri, privateKey } from '../pages/game';
import { getActualState, requestBlockLevel } from './vmApi';
import { cookieBaker, initialState as backeryInitialState } from './cookieBaker';
import { stat } from 'fs';

export type state = {
    error: string | null,
    wallet: InMemorySigner | BeaconWallet | null,
    address: string | null, // TODO: improve with a type Address
    nodeUri: string | null, // TODO: improve with a type URI
    cookieBaker: cookieBaker
}

export const initialState: state = {
    error: null,
    wallet: null,
    address: null,
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
        case "SAVE_ADDRESS": {
            return { ...state, address: action.payload }
        }
        case "SAVE_NODE_URI": {
            return { ...state, nodeUri: action.payload }
        }
    }
}
