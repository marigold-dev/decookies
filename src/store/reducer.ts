import { action, successfullyInit, successfullyMinted } from './actions';
import { nodeUri } from '../pages/game';
import { getActualState, requestBlockLevel } from './http';
import { createHash, createNonce, stringToHex } from './utils';
import { applicationState, cookieBaker } from './cookieBaker';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { SigningType } from '@airgap/beacon-sdk';

// useful to determine if button is disabled or not
export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"
export const buyMine = "buy_mine"

/**
 * dispatch the INIT_STATE_OK, which means we successfully got the state from the VM
 */
const apiCallInit = (dispatch: React.Dispatch<action>, wallet: BeaconWallet | null): null => {
    getActualState(wallet).then(
        _st => {
            dispatch(successfullyInit(dispatch));
        });
    return null;
}

const mintCookie = (dispatch: React.Dispatch<action>, wallet: BeaconWallet | null): null => {
    mint("cookie", wallet).then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

const mintCursor = (dispatch: React.Dispatch<action>, wallet: BeaconWallet | null): null => {
    mint("cursor", wallet).then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

const mintGrandma = (dispatch: React.Dispatch<action>, wallet: BeaconWallet | null): null => {
    mint("grandma", wallet).then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

const mintFarm = (dispatch: React.Dispatch<action>, wallet: BeaconWallet | null): null => {
    mint("farm", wallet).then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}
const mintMine = (dispatch: React.Dispatch<action>, wallet: BeaconWallet | null): null => {
    mint("mine", wallet).then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

/**
 * Classic reducer, perform the related business regarding the received action
 * @param state 
 * @param action 
 * @returns 
 */
export const reducer = (state: applicationState, action: action): applicationState => {
    console.log(action)
    switch (action.type) {
        case "ADD_COOKIE": {
            mintCookie(action.dispatch, state.wallet);
            return state;
        }
        case "ADD_CURSOR": {
            mintCursor(action.dispatch, state.wallet);
            return state;
        }
        case "ADD_GRANDMA": {
            mintGrandma(action.dispatch, state.wallet);
            return state;
        }
        case "ADD_FARM": {
            mintFarm(action.dispatch, state.wallet);
            return state;
        }
        case "ADD_MINE": {
            mintMine(action.dispatch, state.wallet);
            return state;
        }

        case "INIT_STATE_REQUEST": {
            apiCallInit(action.dispatch, state.wallet);
            return state;
        }
        case "INIT_STATE_OK": {
            setInterval(() => { action.dispatch({ type: "CURSOR_PASSIVE_MINT", dispatch: action.dispatch }) }, 10000);
            setInterval(() => { action.dispatch({ type: "PASSIVE_MINT", dispatch: action.dispatch }) }, 1000);
            return state;
        }
        case "CURSOR_PASSIVE_MINT": {
            // This is ugly, but goal is also to test the number of transaction per second of Deku
            // Can easily be reworked with the index.ts on Deku side
            // to provide '{"action":"cookie", "amount":N}'
            for (let i = 0; i < (state.cookieBaker.cursorCps); i++) {
                mintCookie(action.dispatch, state.wallet);
            }
            return state;
        }
        case "PASSIVE_MINT": {
            // see CURSOR_PASSIVE_MINT comment for a rework
            const cps = state.cookieBaker.grandmaCps + state.cookieBaker.farmCps + state.cookieBaker.mineCps;
            for (let i = 0; i < cps; i++) {
                mintCookie(action.dispatch, state.wallet);
            }
            return state;
        }

        case "INIT_STATE_KO": {
            return state;
        }

        case "SUCCESSFULLY_MINTED": {
            return { ...state, cookieBaker: action.cookieBaker };
        }
        case "SET_ADDRESS": {
            return { ...state, address: action.address }
        }
        case "SET_WALLET": {
            return { ...state, wallet: action.wallet }
        }
    }
}

/**
 * Business function to mint the related thing
 * @param action 
 * @returns 
 */
const mint = async (action: string, wallet: BeaconWallet | null): Promise<cookieBaker> => {

    if (wallet === null) {
        return Promise.reject("Wallet is not set");
    } else {

        try {
            const activeAccount = await wallet.client.getActiveAccount();
            let publicKey: string;
            let userAddress: string;
            if (activeAccount) {
                // User already has account connected, everything is ready
                // You can now do an operation request, sign request, or send another permission request to switch wallet
                publicKey = activeAccount.publicKey;
                userAddress = activeAccount.address;
            } else {
                const permissions = await wallet.client.requestPermissions();
                publicKey = permissions.publicKey;
                userAddress = permissions.address;
            }

            const block_height = await requestBlockLevel();
            const payload = action;
            const initialOperation = ["Vm_transaction", {
                payload
            }];
            const jsonToHash = JSON.stringify([userAddress, initialOperation]);
            const innerHash = createHash(jsonToHash);
            const data = {
                hash: innerHash, //⚠ respect the order of fields in the object for serialization
                source: userAddress,
                initial_operation: initialOperation,
            }

            let nonce = createNonce();
            const fullPayload = JSON.stringify([ //FIXME: useless?
                nonce,
                block_height,
                data
            ]);

            // Let's do the same with the Beacon
            const signature = await wallet.client.requestSignPayload({
                signingType: SigningType.RAW,
                payload: stringToHex(fullPayload)
            }).then(val => val.signature);

            // Checked: this publicKey from the wallet is correct
            const key = publicKey;
            const outerHash = createHash(fullPayload);
            const operation = {
                hash: outerHash,
                key,
                signature,
                nonce,
                block_height,
                data
            }
            const packet =
                { user_operation: operation };

            await fetch(nodeUri + "/user-operation-gossip",
                {
                    method: "POST",
                    body: JSON.stringify(packet)
                });
            const new_state: cookieBaker = await getActualState(wallet);
            return new_state;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }
}
