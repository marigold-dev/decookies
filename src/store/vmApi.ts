import { BeaconWallet } from '@taquito/beacon-wallet';
import { InMemorySigner } from '@taquito/signer';
import { SigningType } from '@airgap/beacon-sdk';

import { initialState, cookieBaker } from './cookieBaker';
import { createHash, createNonce, stringToHex } from './utils';

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
export const getActualState = async (userAddress: string, nodeUri: string): Promise<cookieBaker> => {
    const stateRequest = await fetch(nodeUri + "/vm-state",
        {
            method: "POST",
            body: JSON.stringify(null)
        });
    const stateResponse = JSON.parse(await stateRequest.text(), parseReviver);
    const value = stateResponse.state.filter(([address, _gameState]: [string, any]) => address === userAddress);
    console.log("Value: ", value);
    if (value.length === 0) {
        console.info("Starting new game for address:", userAddress);
        return initialState;
    }
    else if (value.length > 1) {
        console.error("More than one record for this address: " + userAddress);
        throw new Error("Impossible");
    } else {
        const finalValue = JSON.parse(value[0][1], parseReviver);
        console.log("FinalValue: " + finalValue);
        return finalValue;
    }
}

/**
 * Helper to correctly parse BigInt
 * @param _key unused
 * @param value can be e BigInt
 * @returns 
 */
const parseReviver = (_key: any, value: any) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
    }
    return value;
}

/**
 * Business function to mint the related thing
 * @param action 
 * @returns {Promise<string>} The hash of the submitted operation
 */
export const mint = async (action: string, signer: InMemorySigner | BeaconWallet, userAddress: string, nodeUri: string): Promise<string> => {
    try {
        let key;
        let address;
        if (signer instanceof BeaconWallet) {
            const activeAccount = await signer.client.getActiveAccount();
            if (activeAccount) {
                // User already has account connected, everything is ready
                // You can now do an operation request, sign request, or send another permission request to switch wallet
                key = activeAccount.publicKey;
                address = activeAccount.address;
            } else {
                const permissions = await signer.client.requestPermissions();
                key = permissions.publicKey;
                address = permissions.address;
            }
        } else {
            key = await signer.publicKey();
            address = userAddress;
        }

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
        let signature;
        if (signer instanceof InMemorySigner) {
            signature = await signer.sign(stringToHex(fullPayload)).then((val) => val.prefixSig);
        } else if (signer instanceof BeaconWallet) {
            signature = await signer.client.requestSignPayload({
                signingType: SigningType.RAW,
                payload: stringToHex(fullPayload)
            }).then(val => val.signature);
        }
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
}
