import { action, state, addCookie } from './actions';
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

export const userAddress = "tz1VULT8pu1NoWs7YPFWuvXSg3JSdGq55TXc";
export const privateKey = "edsk4DyzAscLW5sLqwCshFTorckGBGed318dCt8gvFeUFH9gD9wwVA";
export const nodeUri = 'http://localhost:4440/';


export const getTotalCps = (state: state): number => {
    return state.cursorCps + state.grandmaCps + state.farmCps;
}

const getActualState = async () => {
    const stateRequest = await fetch(nodeUri + "vm-state",
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const stateResponse = await stateRequest.json();
    const value = stateResponse.state.filter(([address, _gameState]) => address === userAddress);
    if (value.length !== 1) {
        console.error("More than one record for this address: " + userAddress);
        alert("More than one record for this address: " + userAddress);
    } else {
        const finalValue = value[0][1];
        return finalValue;
    }
}

const apiCallInit = (dispatch: React.Dispatch<action>) => {
    getActualState().then(
        st => {
            console.log("Init state");
            dispatch({ type: "init_state_ok", state: st.cookieBaker });
        });


    return null;
}

const mintCookie = (dispatch: React.Dispatch<action>) => {
    mint("cookie").then(
        st => {
            dispatch({ type: "init_state_ok", state: st.cookieBaker });
        });

    return null;

}

const mintCursor = (dispatch: React.Dispatch<action>) => {
    mint("cursor").then(
        st => {
            console.log("minting cursor");
            dispatch({ type: "cursor_passive_mint", state: st.cookieBaker, dispatch });
        });

    return null;

}
const mintGrandma = (dispatch: React.Dispatch<action>) => {
    mint("grandma").then(
        st => {
            console.log("minting grandma");
            dispatch({ type: "grandma_passive_mint", state: st.cookieBaker, dispatch });
        });

    return null;

}
const mintFarm = (dispatch: React.Dispatch<action>) => {
    mint("farm").then(
        st => {
            console.log("minting farm");
            dispatch({ type: "init_state_ok", state: st.cookieBaker });
        });

    return null;

}

export const reducer = (s: state, a: action): state => {
    switch (a.type) {
        case "add_cookie": {
            mintCookie(a.dispatch);
            return s;
        }
        case "add_cursor": {
            mintCursor(a.dispatch);
            return s;
        }
        case "add_grandma": {
            mintGrandma(a.dispatch);
            return s;
        }
        case "add_farm": {
            mintFarm(a.dispatch);
            return s;
        }

        case "init_state_request": {
            apiCallInit(a.dispatch)
            return s;
        }
        case "init_state_ok": {
            return a.state;
        }
        case "cursor_passive_mint": {
            setInterval(() => {
                for (let i = 0; i <= (s.cursorCps); i++) {
                    console.log("Passive mint from Cursor")
                    a.dispatch(addCookie(s, a.dispatch));
                }
            }, 10000);
            return a.state;

        }
        case "grandma_passive_mint": {
            setInterval(() => {
                for (let i = 0; i <= (s.grandmaCps); i++) {
                    console.log("Passive mint from Grandmas")
                    a.dispatch(addCookie(s, a.dispatch));
                }
            }, 1000);
            return a.state;

        }
        case "init_state_ko": {
            return s
        }
    }
}

const blockLevel = "block-level";
const userOperationGossip = "user-operation-gossip";

const stringToHex = (payload: string): string => {
    const input = Buffer.from(payload);
    return buf2hex(input);
}

const requestBlockLevel = async () => {
    const blockRequest = await fetch(nodeUri + blockLevel,
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const blockResponse = await blockRequest.json();
    return blockResponse.level;
}

const createNonce = () => {
    const maxInt32 = 2147483647;
    const nonce = Math.floor(Math.random() * maxInt32);
    return nonce;
}

const mint = async (action: string) => {

    const signer = new InMemorySigner(privateKey);

    try {
        const key = await signer.publicKey();

        const block_height: number = await requestBlockLevel();
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
    } catch (err) {
        console.error(err);
    } finally {
        const new_state = await getActualState();
        return new_state;
    }

}
