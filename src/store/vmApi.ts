import { InMemorySigner } from '@taquito/signer';

import { initialState, cookieBaker } from './cookieBaker';
// import { createNonce, stringToHex } from './utils';
import { parseReviver, stringifyReplacer } from './utils';

import { cookieBakerToLeaderBoard, leaderBoard, vmOperation } from './vmTypes';

import { keyPair, state } from './reducer'
import { action, saveUserAddress } from './actions';

import * as deku from '@marigold-dev/deku-toolkit'

export const requestBlockLevel = async (nodeUri: string): Promise<number> => {
    const blockRequest = await fetch(nodeUri + "/api/v1/chain/level",
        {
            method: "GET"
        });
    const blockResponse = await blockRequest.json();
    return blockResponse.level;
}

/**
 * Fetch the state from /vm-state and return the cookieBaker linked to the user address
 */
export const getActualPlayerState = async (dispatch: React.Dispatch<action>, nodeUri: string, keyPair: keyPair | null): Promise<cookieBaker> => {
    if (keyPair) {
        const signer = new InMemorySigner(keyPair.privateKey)
        const userAddress = await signer.publicKeyHash();
        dispatch(saveUserAddress(userAddress));
        const stateRequest = await fetch(nodeUri + "/api/v1/state/unix/",
            {
                method: "GET"
            });
        const stateResponse = JSON.parse(await stateRequest.text(), parseReviver);
        if (stateResponse) {
            if (stateResponse[userAddress]) {
                const cookieBaker = JSON.parse(stateResponse[userAddress], parseReviver);
                return cookieBaker;
            } else {
                return initialState;
            }
        } else {
            console.log("no value in state");
            return initialState;
        }
    } else {
        throw new Error("NO PRIVATE KEY");
    }
}

/**
 * Fetch the state from /vm-state and return the state ordered by DESC amount of cookies
 */
const getRawLeaderBoard = async (nodeUri: string): Promise<any> => {
    const stateRequest = await fetch(nodeUri + "/api/v1/state/unix/",
        {
            method: "GET"
        });
    const stateResponse = JSON.parse(await stateRequest.text(), parseReviver);
    const sorted =
        Object.entries(stateResponse).sort((a, b) => {
            const eatenA = JSON.parse(a[1] as any, parseReviver).eatenCookies;
            const eatenB = JSON.parse(b[1] as any, parseReviver).eatenCookies;
            return Number(eatenB - eatenA);
        });
    return sorted;
}

export const getLeaderBoard = async (nodeUri: string): Promise<leaderBoard[]> => {
    const rawLeaderBoard = await getRawLeaderBoard(nodeUri);
    if (rawLeaderBoard) {
        const leaderBoard = rawLeaderBoard.map((item: any) => cookieBakerToLeaderBoard(item));
        return leaderBoard;
    } else {
        console.log("empty state");
        return [];
    }
}

/**
 * Business function to mint the related thing
 * @param action 
 * @returns {Promise<string>} The hash of the submitted operation
 */
export const mint = async (action: vmOperation, nodeUri: string, latestState: React.MutableRefObject<state>, dispatch: React.Dispatch<action>): Promise<string> => {
    const keyPair = latestState.current.generatedKeyPair;
    if (keyPair && latestState.current.nodeUri) {
        try {
            const inMemorySigner = new InMemorySigner(keyPair.privateKey)
            const dekuSigner = deku.fromMemorySigner(inMemorySigner);
            const dekuToolkit =
                new deku.DekuToolkit(
                    {
                        dekuRpc: latestState.current.nodeUri,
                        dekuSigner
                    }
                );
            const hash =
                await dekuToolkit.submitVmOperation(JSON.stringify(action, stringifyReplacer));

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
