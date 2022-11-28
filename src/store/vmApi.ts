import { InMemorySigner } from '@taquito/signer';

import { initialState, cookieBaker } from './cookieBaker';
import { getLeaderBoardFromState, getPlayerState, leaderBoard } from './utils';

import { state } from './reducer'
import { action, saveUserAddress } from './actions';

/**
 * Fetch the state from /vm-state and return the cookieBaker linked to the user address
 */
//TODO: replace with toolkit.getState();
export const getActualPlayerState = async (dispatch: React.Dispatch<action>, state: React.MutableRefObject<state>): Promise<cookieBaker> => {
    const contract = state.current.dekucContract
    const keyPair = state.current.generatedKeyPair;
    if (keyPair && contract) {
        const signer = new InMemorySigner(keyPair.privateKey)
        const userAddress = await signer.publicKeyHash();
        dispatch(saveUserAddress(userAddress));
        const globalState = await contract.getState();
        const playerState = getPlayerState(globalState, userAddress);
        if (playerState) {
            return playerState;
        } else {
            return initialState;
        }
    } else {
        throw new Error("NO PRIVATE KEY");
    }
}

/**
 * Fetch the state from /vm-state and return the state ordered by DESC amount of cookies
 */
const getRawLeaderBoard = (vmState: any): any => {
    // const contract = state.current.dekucContract
    const allCookieBakers: leaderBoard[] = Object.keys(vmState).map(key => getLeaderBoardFromState(vmState, key));
    const sorted =
        Object.entries(allCookieBakers).sort((a, b) => {
            const eatenA = a[1].cookieBaker.eatenCookies;
            const eatenB = b[1].cookieBaker.eatenCookies;
            return Number(eatenB - eatenA);
        });
    return sorted;
}

export const getLeaderBoard = (vmState: any): leaderBoard[] => {
    const rawLeaderBoard = getRawLeaderBoard(vmState);
    return rawLeaderBoard;
}

/**
 * Business function to mint the related thing
 * @param action 
 * @returns {Promise<string>} The hash of the submitted operation
 */
export const mint = async (vmAction: any, latestState: React.MutableRefObject<state>): Promise<string> => {
    const keyPair = latestState.current.generatedKeyPair;
    const contract = latestState.current.dekucContract;
    if (keyPair && latestState.current.nodeUri && contract) {
        try {
            const hash = await contract.invoke(vmAction);
            return hash;
        } catch (err) {
            const error_msg = (typeof err === 'string') ? err : (err as Error).message;
            throw new Error(error_msg);;
        }
    } else {
        throw new Error("No private key in local storage")
    }
}
