import { action, state } from './actions';
import { InMemorySigner } from '@taquito/signer';
import { encodeExpr, buf2hex, b58decode } from '@taquito/utils';

export const initialState: state = {
    numberOfCookie: 0,
    numberOfCursor: 0.,
    numberOfGrandma: 0.,
    numberOfFarm: 0.,
    numberOfFreeCursor: 0,
    numberOfFreeGrandma: 0,
    numberOfFreeFarm: 0,
    cursorCost: 0,
    grandmaCost: 0,
    farmCost: 0,
    cursorCps: 0,
    grandmaCps: 0,
    farmCps: 0
}

export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"


export const userAddress = "tz1VULT8pu1NoWs7YPFWuvXSg3JSdGq55TXc";
export const privateKey = "edsk4DyzAscLW5sLqwCshFTorckGBGed318dCt8gvFeUFH9gD9wwVA";
export const nodeUri = 'http://localhost:4440/';

export const isButtonEnabled = (state: state, button: string): boolean => {
    switch (button) {
        case "buy_cursor": {
            return (state.cursorCost <= state.numberOfCookie);
        }
        case "buy_grandma": {
            return (state.grandmaCost <= state.numberOfCookie);
        }
        case "buy_farm": {
            return (state.farmCost <= state.numberOfCookie);
        }
    }
    return true;

}

export const getTotalCps = (state: state): number => {
    return state.cursorCps + state.grandmaCps + state.farmCps;
}

const getActualState = async (): Promise<state> => {
    const stateRequest = await fetch(nodeUri + "vm-state",
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const stateResponse = await stateRequest.json();
    const value = stateResponse.state.filter(([address, _gameState]: [string, any]) => address === userAddress);
    if (value.length !== 1) {
        console.error("More than one record for this address: " + userAddress);
        alert("More than one record for this address: " + userAddress);
    } else {
        const finalValue = value[0][1];
        return finalValue.cookieBaker;
    }
}

const apiCallInit = (dispatch: React.Dispatch<action>): Promise<state> => {
    getActualState().then(
        st => {
            dispatch({ type: "INIT_STATE_OK", dispatch });
        });
    return null;
}

const mintCookie = (dispatch: React.Dispatch<action>): Promise<state> => {
    mint("cookie").then(
        st => {
            dispatch({ type: "SUCCESSFULLY_MINTED", state: st });
            return st;
        });
    return null;
}

const mintCursor = (dispatch: React.Dispatch<action>): Promise<state> => {
    mint("cursor").then(
        st => {
            dispatch({ type: "SUCCESSFULLY_MINTED", state: st });
        });
    return null;
}
const mintGrandma = (dispatch: React.Dispatch<action>): Promise<state> => {
    mint("grandma").then(
        st => {
            dispatch({ type: "SUCCESSFULLY_MINTED", state: st });
        });
    return null;
}
const mintFarm = (dispatch: React.Dispatch<action>): Promise<state> => {
    mint("farm").then(
        st => {
            dispatch({ type: "SUCCESSFULLY_MINTED", state: st });
        });
    return null;
}

export const reducer = (s: state, a: action): state => {
    switch (a.type) {
        case "ADD_COOKIE": {
            mintCookie(a.dispatch);
            return s;
        }
        case "ADD_CURSOR": {
            mintCursor(a.dispatch);
            return s;
        }
        case "ADD_GRANDMA": {
            mintGrandma(a.dispatch);
            return s;
        }
        case "ADD_FARM": {
            mintFarm(a.dispatch);
            return s;
        }

        case "INIT_STATE_REQUEST": {
            apiCallInit(a.dispatch)
            return s;
        }
        case "INIT_STATE_OK": {
            setInterval(() => { a.dispatch({ type: "CURSOR_PASSIVE_MINT", dispatch: a.dispatch }) }, 10000);
            setInterval(() => { a.dispatch({ type: "PASSIVE_MINT", dispatch: a.dispatch }) }, 1000);
            return s;
        }
        case "CURSOR_PASSIVE_MINT": {
            for (let i = 0; i < (s.cursorCps); i++) {
                mintCookie(a.dispatch);
            }
            return s;
        }
        case "PASSIVE_MINT": {
            const cps = s.grandmaCps + s.farmCps;
            for (let i = 0; i < cps; i++) {
                mintCookie(a.dispatch);
            }
            return s;
        }

        case "INIT_STATE_KO": {
            return s;
        }

        case "SUCCESSFULLY_MINTED": {
            return a.state;
        }
    }
}

const blockLevel = "block-level";
const userOperationGossip = "user-operation-gossip";

const stringToHex = (payload: string): string => {
    const input = Buffer.from(payload);
    return buf2hex(input);
}

const requestBlockLevel = async (): Promise<number> => {
    const blockRequest = await fetch(nodeUri + blockLevel,
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const blockResponse = await blockRequest.json();
    return blockResponse.level;
}

const createNonce = (): number => {
    const maxInt32 = 2147483647;
    const nonce = Math.floor(Math.random() * maxInt32);
    return nonce;
}

const mint = async (action: string): Promise<state> => {

    const signer = new InMemorySigner(privateKey);

    try {
        const key = await signer.publicKey();

        const block_height = await requestBlockLevel();
        const payload = action;
        const initialOperation = ["Vm_transaction", {
            payload
        }];
        const jsonToHash = JSON.stringify([userAddress, initialOperation]);
        const innerHash = b58decode(encodeExpr(stringToHex(jsonToHash))).slice(4, -2);
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

        const outerHash = b58decode(encodeExpr(stringToHex(fullPayload))).slice(4, -2);
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

        await fetch(nodeUri + userOperationGossip,
            {
                method: "POST",
                body: JSON.stringify(packet)
            });
        const new_state: state = await getActualState();
        return new_state;
    } catch (err) {
        console.error(err);
    }
}
