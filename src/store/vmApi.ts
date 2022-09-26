import { InMemorySigner } from '@taquito/signer';

import { initialState, cookieBaker } from './cookieBaker';
import { createHash, createNonce, parseReviver, stringifyReplacer, stringToHex } from './utils';

import { cookieBakerToLeaderBoard, leaderBoard, vmOperation } from './vmTypes';

import { keyPair } from './reducer'

export const requestBlockLevel = async (nodeUri: string): Promise<number> => {
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
export const getActualState = async (nodeUri: string, keyPair: keyPair | null): Promise<cookieBaker> => {
    if (keyPair) {
        const signer = new InMemorySigner(keyPair.privateKey)
        const userAddress = await signer.publicKeyHash();
        const stateRequest = await fetch(nodeUri + "/vm-state",
            {
                method: "POST",
                body: JSON.stringify(null)
            });
        const stateResponse = JSON.parse(await stateRequest.text(), parseReviver);
        const value = stateResponse.state.filter(([address, _gameState]: [string, any]) => address === userAddress);
        if (value.length === 0) {
            return initialState;
        }
        else if (value.length > 1) {
            throw new Error(("Found more than one state for this address" + userAddress));
        } else {
            const finalValue = JSON.parse(value[0][1], parseReviver);
            return finalValue;
        }
    } else {
        throw new Error("NO PRIVATE KEY");
    }
}

/**
 * Fetch the state from /vm-state and return the state ordered by DESC amount of cookies
 */
const getRawLeaderBoard = async (nodeUri: string): Promise<any> => {
    const stateRequest = await fetch(nodeUri + "/vm-state",
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const stateResponse = JSON.parse(await stateRequest.text(), parseReviver);
    const value = stateResponse.state.sort(((n1: any, n2: any) => {
        const baker1: cookieBaker = JSON.parse(n1[1], parseReviver);
        const baker2: cookieBaker = JSON.parse(n2[1], parseReviver);
        // we want DESC ordering
        return Number(baker2.eatenCookies - baker1.eatenCookies)
    }));
    return value;
}

export const getLeaderBoard = async (nodeUri: string): Promise<leaderBoard[]> => {
    const rawLeaderBoard = await getRawLeaderBoard(nodeUri);
    const leaderBoard = rawLeaderBoard.flatMap((item: any) => cookieBakerToLeaderBoard(item));
    return leaderBoard;
}

/**
 * Business function to mint the related thing
 * @param action 
 * @returns {Promise<string>} The hash of the submitted operation
 */
export const mint = async (action: vmOperation, nodeUri: string, keyPair: keyPair | null): Promise<string> => {
    if (keyPair) {
        try {
            const signer = new InMemorySigner(keyPair.privateKey)

            const address = await signer.publicKeyHash();
            const key = await signer.publicKey();

            const block_height = await requestBlockLevel(nodeUri);
            const payload = action;
            const initialOperation = ["Vm_transaction", {
                payload
            }];
            const jsonToHash = JSON.stringify([address, initialOperation]);
            const innerHash = createHash(jsonToHash);
            const data = {
                hash: innerHash, //⚠ respect the order of fields in the object for serialization
                source: address,
                initial_operation: initialOperation,
            }

            let nonce = createNonce();
            const fullPayload = JSON.stringify([ //FIXME: useless?
                nonce,
                block_height,
                data
            ], stringifyReplacer);

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
            // Resolving the promess only means that the request succeed
            // We cannot guess more wiith current VM API
            await fetch(nodeUri + "/user-operation-gossip",
                {
                    method: "POST",
                    body: JSON.stringify(packet)
                });
            return outerHash;
        } catch (err) {
            const error_msg = (typeof err === 'string') ? err : (err as Error).message;
            throw new Error(error_msg);;
        }
    } else {
        throw new Error("No private key in local storage")
    }
}
