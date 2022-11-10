import { InMemorySigner } from '@taquito/signer';

import { initialState, cookieBaker } from './cookieBaker';
// import { createNonce, stringToHex } from './utils';
import { getSomethingState, getPlayerState, leaderBoard } from './utils';

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
const getRawLeaderBoard = async (state: React.MutableRefObject<state>): Promise<any> => {
    const contract = state.current.dekucContract
    if (contract) {
        const globalState = await contract.getState();
        console.log("globalState: ", globalState);
        const allCookieBakers: leaderBoard[] = Object.keys(globalState).map(key => getSomethingState(globalState, key));
        console.log("all: ", allCookieBakers)
        const sorted =
            Object.entries(allCookieBakers).sort((a, b) => {
                const eatenA = a[1].cookieBaker.eatenCookies;
                const eatenB = b[1].cookieBaker.eatenCookies;
                return Number(eatenB - eatenA);
            });
        console.log("sorted: ", sorted);
        return sorted;
    }
}

export const getLeaderBoard = async (state: React.MutableRefObject<state>): Promise<leaderBoard[]> => {
    console.log("leaderboard");
    const rawLeaderBoard = await getRawLeaderBoard(state);
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
            // const hash = await contract.invoke([
            //     "Pair",
            //     [
            //         "Pair",
            //         ["Int", "1"],
            //         [
            //             "Union",
            //             [
            //                 "Left",
            //                 ["Union", ["Left", ["Union", ["Left", ["Unit"]]]]]
            //             ]
            //         ]
            //     ],
            //     [
            //         "Pair",
            //         ["Union", ["Left", ["Union", ["Right", ["Unit"]]]]],
            //         ["Option", null]
            //     ]
            // ]);


            // await dekuToolkit.submitVmOperation(JSON.stringify(action, stringifyReplacer));


            // const address = await signer.publicKeyHash();
            // const key = await signer.publicKey();

            // const level = await requestBlockLevel(nodeUri);
            // const payload = action;
            // const content = ["Vm_transaction", {
            //     operation: JSON.stringify(payload, stringifyReplacer),
            //     tickets: []
            // }];
            // const source = address;
            // let nonce = createNonce().toString();
            // const operation = {
            //     level,
            //     nonce,
            //     source,
            //     content
            // };
            // const signature = await signer.sign(stringToHex(JSON.stringify(operation))).then((val) => val.prefixSig);
            // const fullPayload = JSON.stringify({
            //     key,
            //     signature,
            //     operation
            // }, stringifyReplacer);

            // const hash = await fetch(nodeUri + "/api/v1/operations",
            //     {
            //         method: "POST",
            //         body: fullPayload
            //     });
            //TODO: here?
            // const inOven = latestState.current.cookiesInOven + 1n;
            // console.log("inOven: ", inOven);
            // dispatch(updateOven(inOven));
            return hash;
        } catch (err) {
            const error_msg = (typeof err === 'string') ? err : (err as Error).message;
            throw new Error(error_msg);;
        }
    } else {
        throw new Error("No private key in local storage")
    }
}
