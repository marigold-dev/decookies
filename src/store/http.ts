import { userAddress, nodeUri } from '../pages/game';
import { initialState, cookieBaker } from './cookieBaker';

export const requestBlockLevel = async (): Promise<number> => {
    const blockRequest = await fetch(nodeUri + "/block-level",
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const blockResponse = await blockRequest.json();
    return blockResponse.level;
}

/**
 * Fetch the state from /vm-state and return the cookieBaker linked to the user address
 */
export const getActualState = async (): Promise<cookieBaker> => {
    const stateRequest = await fetch(nodeUri + "/vm-state",
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const stateResponse = await stateRequest.json();
    const value = stateResponse.state.filter(([address, _gameState]: [string, any]) => address === userAddress);
    if (value.length !== 1) {
        console.error("More than one record for this address: " + userAddress);
        alert("More than one record for this address: " + userAddress);
        return initialState;
    } else {
        const finalValue = value[0][1];
        return finalValue.cookieBaker;
    }
}
