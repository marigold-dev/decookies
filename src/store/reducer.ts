import {  state } from './actions';
import { encodeExpr, b58decode } from '@taquito/utils';
import { ReadOnlySigner } from "./wallet"
import * as utils from "./utils"
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

export const buyCursor = "buy_cursor"
export const buyGrandma = "buy_grandma"
export const buyFarm = "buy_farm"

export const initialState: state = {
    numberOfCookie: 0,
    numberOfCursor: 0.,
    numberOfGrandma: 0.,
    numberOfFarm: 0.,
    numberOfFreeCursor: 0,
    numberOfFreeGrandma: 0,
    numberOfFreeFarm: 0,
    cursorCost: 0,
    grandmaCost: 0,
    farmCost: 0,
    cursorCps: 0,
    grandmaCps: 0,
    farmCps: 0,
}

export const mint = async (action: string, account : string,wallet : BeaconWallet,tezos : TezosToolkit): Promise<state> => {
    const userAddress = account;
    const activeAcc = await wallet.client.getActiveAccount();
    if (!activeAcc) {
        throw new Error("Not connected");
    }
    tezos.setSignerProvider(
        new ReadOnlySigner(userAddress, activeAcc.publicKey)
    );

    try {
        const key = await tezos.signer.publicKey();
        const block_height = await utils.requestBlockLevel();
        const payload = action;
        const initialOperation = ["Vm_transaction", {
            payload
        }];
        const jsonToHash = JSON.stringify([userAddress, initialOperation]);
        const innerHash = b58decode(encodeExpr(utils.stringToHex(jsonToHash))).slice(4, -2);
        const data = {
            hash: innerHash, //⚠ respect the order of fields in the object for serialization
            source: userAddress,
            initial_operation: initialOperation,
        }
        let nonce = utils.createNonce();
        const fullPayload = JSON.stringify([ //FIXME: useless?
            nonce,
            block_height,
            data
        ]);
        const outerHash = b58decode(encodeExpr(utils.stringToHex(fullPayload))).slice(4, -2);
        const signature = await tezos.signer.sign(utils.stringToHex(fullPayload)).then((val) => val.prefixSig);
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
        await fetch(utils.nodeUri + utils.userOperationGossip,
            {
                method: "POST",
                body: JSON.stringify(packet)
            });
        const new_state: state = await utils.getActualState(account);
        return new_state;
    } catch (err) {
        console.error(err);
    }
}

