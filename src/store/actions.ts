import { InMemorySigner } from '@taquito/signer';
import * as React from 'react'
import { nodeUri, userAddress } from '../pages/game';
import { cookieBaker } from './cookieBaker'
import { getActualState, requestBlockLevel } from './http';
import { createHash, createNonce, stringToHex } from './utils';

/**
 * All the actions available
 */
type successfulMint = {
    type: "SUCCESSFULLY_MINTED",
    state: cookieBaker
}
type initStateRequest = {
    type: "INIT_STATE_REQUEST",
    dispatch: React.Dispatch<action>
}
export type initStateOk = {
    type: "INIT_STATE_OK",
    dispatch: React.Dispatch<action>
}
export type initStateKo = {
    type: "INIT_STATE_KO",
    msg: string
}
export type cursorPassiveMint = {
    type: "CURSOR_PASSIVE_MINT",
    dispatch: React.Dispatch<action>
}
export type passiveMint = {
    type: "PASSIVE_MINT",
    dispatch: React.Dispatch<action>
}
export type updateVMState = {
    type: "FETCH_VM_STATE"
}
export type updateVMStateSuccess = {
    type: "FETCH_VM_STATE_SUCCESS"
}
export type updateVMStateFailed = {
    type: "FETCH_VM_STATE_FAILED"
}


export type action = updateVMState | updateVMStateSuccess | updateVMStateFailed | initStateRequest | initStateOk | initStateKo | passiveMint | cursorPassiveMint | successfulMint

// Utils

type mintable = "cookie" | "cursor" | "grandma" | "farm" | "mine";

/**
 * Business function to mint the related thing
 * @param action 
 * @returns 
 */
 const mint = async (token: mintable): Promise<cookieBaker> => {

    const signer = new InMemorySigner("edsk4DyzAscLW5sLqwCshFTorckGBGed318dCt8gvFeUFH9gD9wwVA");

    try {
        const key = await signer.publicKey();

        const payload = action;
        const initialOperation = ["Vm_transaction", {
            payload
        }];
        const jsonToHash = JSON.stringify([userAddress, initialOperation]);
        const innerHash = createHash(jsonToHash);
        const data = {
            hash: innerHash, //⚠ respect the order of fields in the object for serialization
            source: userAddress,
            initial_operation: initialOperation,
        }
        
        const block_height = await requestBlockLevel();
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

        await fetch(nodeUri + "/user-operation-gossip",
            {
                method: "POST",
                body: JSON.stringify(packet)
            });
        const newState: cookieBaker = await getActualState();
        return newState;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


const mintCookie = (dispatch: React.Dispatch<action>): Promise<cookieBaker> => {
    mint("cookie").then(
        st => {
            dispatch(successfullyMinted(st));
        });
    return null;
}

// Action creators
const add = (type: mintable) => (dispatch: React.Dispatch<action>): action =>{
    switch (type) {
        case "cookie": mint(cookie)
    }
}

export const addCookie = add("cookie");
export const addCursor = add("cursor");
export const addGrandma = add("grandma");
export const addFarm = add("farm");
export const addMine = add("mine");

export const requestInit = (dispatch: React.Dispatch<action>): action => ({
    type: "INIT_STATE_REQUEST",
    dispatch
})
export const successfullyInit = (dispatch: React.Dispatch<action>): action => ({
    type: "INIT_STATE_OK",
    dispatch
})
export const activatePassiveMint = (dispatch: React.Dispatch<action>): action => ({
    type: "PASSIVE_MINT",
    dispatch
})
export const activateCursorPassiveMint = (dispatch: React.Dispatch<action>): action => ({
    type: "CURSOR_PASSIVE_MINT",
    dispatch
})
export const successfullyMinted = (state: cookieBaker): action => ({
    type:"SUCCESSFULLY_MINTED",
    state
})
