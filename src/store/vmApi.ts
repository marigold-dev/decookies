import { InMemorySigner } from '@taquito/signer';

import { initialState, cookieBaker } from './cookieBaker';
import { createHash, createNonce, parseReviver, stringToHex } from './utils';

import * as crypto from 'crypto-js';
import { nickName } from '../pages/game';
import { vmOperation } from './vmTypes';

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
export const getActualState = async (nodeUri: string): Promise<cookieBaker> => {

    const encryptedPrivateKey = localStorage.getItem("privateKey");
    if (encryptedPrivateKey) {
        const bytes = crypto.AES.decrypt(encryptedPrivateKey, nickName);
        const gamingPrivateKey = bytes.toString(crypto.enc.Utf8);
        const signer = new InMemorySigner(gamingPrivateKey);
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
    } else
        throw new Error("No private key in local storage");
}

/**
 * Business function to mint the related thing
 * @param action 
 * @returns {Promise<string>} The hash of the submitted operation
 */
export const mint = async (action: vmOperation, nodeUri: string): Promise<string> => {
    const encryptedPrivateKey = localStorage.getItem("privateKey");
    if (encryptedPrivateKey) {
        const bytes = crypto.AES.decrypt(encryptedPrivateKey, nickName);
        const gamingPrivateKey = bytes.toString(crypto.enc.Utf8);
        const signer = new InMemorySigner(gamingPrivateKey);
        try {

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
            ]);

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
