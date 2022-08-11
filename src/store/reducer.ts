import { action, successfullyInit, successfullyMinted } from './actions';
import { InMemorySigner } from '@taquito/signer';
import { userAddress, nodeUri, privateKey } from '../pages/game';
import { getActualState, requestBlockLevel } from './http';
import { createHash, createNonce, stringToHex } from './utils';
import { cookieBaker } from './cookieBaker';

// useful to determine if button is disabled or not
export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"

/**
 * dispatch the INIT_STATE_OK, which means we successfully got the state from the VM
 */
const apiCallInit = (dispatch: React.Dispatch<action>): Promise<cookieBaker> => {
    getActualState().then(
        _st => {
            dispatch(successfullyInit(dispatch));
        });
    return null;
}

const mintCookie = (dispatch: React.Dispatch<action>): Promise<cookieBaker> => {
    mint("cookie").then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

const mintCursor = (dispatch: React.Dispatch<action>): Promise<cookieBaker> => {
    mint("cursor").then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

const mintGrandma = (dispatch: React.Dispatch<action>): Promise<cookieBaker> => {
    mint("grandma").then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

const mintFarm = (dispatch: React.Dispatch<action>): Promise<cookieBaker> => {
    mint("farm").then(
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
export const reducer = (state: cookieBaker, action: action): cookieBaker => {
    switch (action.type) {
        case "ADD_COOKIE": {
            mintCookie(action.dispatch);
            return state;
        }
        case "ADD_CURSOR": {
            mintCursor(action.dispatch);
            return state;
        }
        case "ADD_GRANDMA": {
            mintGrandma(action.dispatch);
            return state;
        }
        case "ADD_FARM": {
            mintFarm(action.dispatch);
            return state;
        }

        case "INIT_STATE_REQUEST": {
            apiCallInit(action.dispatch)
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
            for (let i = 0; i < (state.cursorCps); i++) {
                mintCookie(action.dispatch);
            }
            return state;
        }
        case "PASSIVE_MINT": {
            // see CURSOR_PASSIVE_MINT comment for a rework
            const cps = state.grandmaCps + state.farmCps;
            for (let i = 0; i < cps; i++) {
                mintCookie(action.dispatch);
            }
            return state;
        }

        case "INIT_STATE_KO": {
            return state;
        }

        case "SUCCESSFULLY_MINTED": {
            return action.state;
        }
    }
}

/**
 * Business function to mint the related thing
 * @param action 
 * @returns 
 */
const mint = async (action: string): Promise<cookieBaker> => {

    const signer = new InMemorySigner(privateKey);

    try {
        const key = await signer.publicKey();

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

        const outerHash = createHash(fullPayload);
        const signature = await signer.sign(stringToHex(fullPayload)).then((val) => val.prefixSig);
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
        const new_state: cookieBaker = await getActualState();
        return new_state;
    } catch (err) {
        console.error(err);
    }
}
