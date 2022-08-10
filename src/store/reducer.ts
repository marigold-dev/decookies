import { action, state } from './actions';
import { encodeExpr, b58decode } from '@taquito/utils';
import { TezosToolkit } from '@taquito/taquito';
import { getAccount, wallet, ReadOnlySigner } from "./wallet"
import  * as utils from "./utils"

// TEZOS connect to wallet: todo add the network ex: ithacanet 
export const tezos = new TezosToolkit("https://jakartanet.smartpy.io");

// Specify wallet provider for Tezos instance 
tezos.setWalletProvider(wallet);

export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"

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

const mint = async (action: string): Promise<state> => {
    const userAddress = await getAccount();
    const activeAcc = await wallet.client.getActiveAccount();
    if (!activeAcc) {
        throw new Error("Not connected");
    }
    tezos.setSignerProvider(
        new ReadOnlySigner(userAddress, activeAcc.publicKey)
    );
    try {
        const key = await tezos.signer.publicKey();
        const block_height = await utils.requestBlockLevel();
        const payload = action;
        const initialOperation = ["Vm_transaction", {
            payload
        }];
        const jsonToHash = JSON.stringify([userAddress, initialOperation]);
        const innerHash = b58decode(encodeExpr(utils.stringToHex(jsonToHash))).slice(4, -2);
        const data = {
            hash: innerHash, //⚠ respect the order of fields in the object for serialization
            source: userAddress,
            initial_operation: initialOperation,
        }
        let nonce = utils.createNonce();
        const fullPayload = JSON.stringify([ //FIXME: useless?
            nonce,
            block_height,
            data
        ]);
        const outerHash = b58decode(encodeExpr(utils.stringToHex(fullPayload))).slice(4, -2);
        const signature = await tezos.signer.sign(utils.stringToHex(fullPayload)).then((val) => val.prefixSig);
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
        await fetch(utils.nodeUri + utils.userOperationGossip,
            {
                method: "POST",
                body: JSON.stringify(packet)
            });
        const new_state: state = await utils.getActualState();
        return new_state;
    } catch (err) {
        console.error(err);
    }
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
            utils.apiCallInit(a.dispatch)
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
