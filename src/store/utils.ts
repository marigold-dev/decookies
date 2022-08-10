import { action, state } from "./actions"
import { getAccount } from "./wallet";
import { buf2hex } from '@taquito/utils';

export const nodeUri = 'http://localhost:4440/';
const blockLevel = "block-level";
export const userOperationGossip = "user-operation-gossip";

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

export const getActualState = async (): Promise<state> => {
    const userAddress = await getAccount();
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

export const apiCallInit = (dispatch: React.Dispatch<action>): Promise<state> => {
    getActualState().then(
        st => {
            dispatch({ type: "INIT_STATE_OK", dispatch });
        });
    return null;
}

export const stringToHex = (payload: string): string => {
    const input = Buffer.from(payload);
        return buf2hex(input);
}

export const requestBlockLevel = async (): Promise<number> => {
    const blockRequest = await fetch(nodeUri + blockLevel,
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const blockResponse = await blockRequest.json();
    return blockResponse.level;
}

export const createNonce = (): number => {
    const maxInt32 = 2147483647;
    const nonce = Math.floor(Math.random() * maxInt32);
    return nonce;
}