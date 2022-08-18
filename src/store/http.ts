import { BeaconWallet } from '@taquito/beacon-wallet';
import { nodeUri } from '../pages/game';
import { cookieBaker, initialCookieBaker } from './cookieBaker';

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
export const getActualState = async (wallet: BeaconWallet | null): Promise<cookieBaker> => {
    if (wallet === null) {
        return Promise.reject("Wallet is not set");
    } else {
        let userAddress: string;
        const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount) {
            // User already has account connected, everything is ready
            // You can now do an operation request, sign request, or send another permission request to switch wallet
            userAddress = activeAccount.address;
        } else {
            const permissions = await wallet.client.requestPermissions();
            userAddress = permissions.address;
        }

        const stateRequest = await fetch(nodeUri + "/vm-state",
            {
                method: "POST",
                body: JSON.stringify(null)
            });
        const stateResponse = JSON.parse(await stateRequest.text(), parseReviver);
        const value = stateResponse.state.filter(([address, _gameState]: [string, any]) => address === userAddress);
        console.log("Value: " + value);
        if (value.length !== 1) {
            console.error("More than one record for this address: " + userAddress);
            alert("More than one record for this address: " + userAddress);
            return initialCookieBaker;
        } else {
            const finalValue = JSON.parse(value[0][1], parseReviver);
            console.log("FinalValue: " + finalValue);
            return finalValue;
        }
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
