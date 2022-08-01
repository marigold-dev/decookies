import { action, activateCursorPassiveMint, state } from './actions';
import { InMemorySigner } from '@taquito/signer';
import { encodeExpr, buf2hex, b58decode } from '@taquito/utils';

export const initialState: state = {
    number_of_cookie: 0,
    number_of_cursor: 0.,
    number_of_grandma: 0.,
    number_of_farm: 0.,
    number_of_free_cursor: 0,
    number_of_free_grandma: 0,
    number_of_free_farm: 0,
    cursor_cost: 0,
    grandma_cost: 0,
    farm_cost: 0,
    cursor_cps: 0,
    grandma_cps: 0,
    farm_cps: 0
}

export const address = "tz1VULT8pu1NoWs7YPFWuvXSg3JSdGq55TXc";
export const privateKey = "edsk4DyzAscLW5sLqwCshFTorckGBGed318dCt8gvFeUFH9gD9wwVA";
export const nodeUri = 'http://localhost:4440/';

let passive_cursor_mint_activated = false;


const get_actual_state = async () => {
    const state_request = await fetch(nodeUri + "vm-state",
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const state_response = await state_request.json();
    console.log("Got initial state from VM:");
    console.log(JSON.stringify(state_response));
    const value = state_response.state.filter(([address, _game_state]) => address === address);
    if (value.length !== 1) {
        console.error("More than one record for this address: " + address);
        alert("More than one record for this address: " + address);
    } else {
        const final_value = value[0][1];
        return final_value;
    }
}

const api_call_init = (dispatch: React.Dispatch<action>) => {
    get_actual_state().then(
        st => {
            console.log("Init state");
            console.log(st);
            dispatch({ type: "init_state_ok", state: st.cookie_baker });
        });


    return null;
}

const mintCookie = (dispatch: React.Dispatch<action>) => {
    const _operation_submitted = mint("cookie").then(
        st => {
            console.log(st);
            dispatch({ type: "init_state_ok", state: st.cookie_baker });
        });

    return null;

}
const mintCursor = (dispatch: React.Dispatch<action>) => {
    console.log("minting cursor");
    const _operation_submitted = mint("cursor").then(
        st => {
            console.log(st);
            dispatch({ type: "init_state_ok", state: st.cookie_baker });
        });

    return null;

}
const mintGrandma = (dispatch: React.Dispatch<action>) => {
    console.log("minting grandma");
    const _operation_submitted = mint("grandma").then(
        st => {
            console.log(st);
            dispatch({ type: "init_state_ok", state: st.cookie_baker });
        });

    return null;

}
const mintFarm = (dispatch: React.Dispatch<action>) => {
    console.log("minting farm");
    const _operation_submitted = mint("farm").then(
        st => {
            console.log(st);
            dispatch({ type: "init_state_ok", state: st.cookie_baker });
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
            api_call_init(a.dispatch)
            return s;
        }
        case "init_state_ok": {
            return a.state;
        }
        case "init_state_ko": {
            return s
        }
    }
}

const block_level = "block-level";
const user_operation_gossip = "user-operation-gossip";

const stringToHex = (payload: string): string => {
    const input = Buffer.from(payload);
    return buf2hex(input);
}

const request_block_level = async () => {
    const block_request = await fetch(nodeUri + block_level,
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const block_response = await block_request.json();
    return block_response.level;
}

const create_nonce = () => {
    const max_int_32 = 2147483647;
    const nonce = Math.floor(Math.random() * max_int_32);
    return nonce;
}


const mint = async (action: string) => {

    const signer = new InMemorySigner(privateKey);

    try {
        const key = await signer.publicKey();

        const block_height: number = await request_block_level();
        const payload = action;
        const initial_operation = ["Vm_transaction", {
            payload
        }];
        const json_to_hash = JSON.stringify([address, initial_operation]);
        const inner_hash = b58decode(encodeExpr(stringToHex(json_to_hash))).slice(4, -2);
        const data = {
            hash: inner_hash, //⚠ respect the order of fields in the object for serialization
            source: address,
            initial_operation: initial_operation,
        }

        let nonce = create_nonce();
        const full_payload = JSON.stringify([ //FIXME: useless?
            nonce,
            block_height,
            data
        ]);

        const outer_hash = b58decode(encodeExpr(stringToHex(full_payload))).slice(4, -2);
        const signature = await signer.sign(stringToHex(full_payload)).then((val) => val.prefixSig);
        const operation = {
            hash: outer_hash,
            key,
            signature,
            nonce,
            block_height,
            data
        }
        const packet =
            { user_operation: operation };
        console.log("PACKET: ");
        console.log(JSON.stringify(packet));

        await fetch(nodeUri + user_operation_gossip,
            {
                method: "POST",
                body: JSON.stringify(packet)
            });
    } catch (err) {
        console.error(err);
    } finally {
        const new_state = await get_actual_state();
        return new_state;
    }

}
