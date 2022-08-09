
// Setup beacon wallet instance 
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit, Signer } from "@taquito/taquito";

export const wallet = new BeaconWallet({
    name: "Cookie Game Dapp",
    // TODO: why it raise error here??
    //preferredNetwork: "ithacanet"
});

// An address is either a string or undefined
let userAddress: string | undefined

// Setup connectWallet function
export const connectWallet = async () => {
    await wallet.requestPermissions({});
    userAddress = await wallet.getPKH();
    console.log("New connection:", userAddress);
    return userAddress;
};

// Setup getAccount function
export const getAccount = async () => {
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
        // If defined, the user is connected to a wallet
        // You can now do an operation request, sign request, or 
        // send another permission request to switch wallet
        console.log("Already connected:", activeAccount.address);
        userAddress = activeAccount.address;
        return userAddress;
    } else {
        connectWallet();
    }
}

// readOnlySigner from a signer class
export class ReadOnlySigner implements Signer {
    constructor(private pkh: string, private pk: string) { }

    async publicKeyHash() {
        return this.pkh;
    };

    async publicKey() {
        return this.pk;
    };

    async secretKey(): Promise<string> {
        throw new Error("Secret key cannot be exposed");
    };

    async sign(): Promise<{
        bytes: string;
        sig: string;
        prefixSig: string;
        sbytes: string;
    }> {
        throw new Error("Cannot sign");
    }
}

// TODO: figure out how to use this function or remove it
export async function useWalletBeacon() {

    /*const activeAcount = await wallet.client.getActiveAccount();
    if (forcePermission || !activeAcount) {
        await wallet.clearActiveAccount();
    }*/

    const activeAcc = await wallet.client.getActiveAccount();

    if (!activeAcc) {
        await wallet.clearActiveAccount();
    }

    // get permission to access the wallet 
    await wallet.requestPermissions();

    // TODO: change the rpc
    const tezos = new TezosToolkit("https://jakartanet.smartpy.io");

    // specify wallet provider for tezos instance 

    tezos.setWalletProvider(wallet);

    // get active account again for sign
    //const activeAcc = await wallet.client.getActiveAccount();

    if (!activeAcc) {
        throw new Error("Not connected");
    }

    // set signer provider 
    tezos.setSignerProvider(
        new ReadOnlySigner(activeAcc.address, activeAcc.publicKey)
    );

    setLastUsedConnect("beacon");

    return tezos;

}


function setLastUsedConnect(val: "beacon") {
    return localStorage.setItem("last-used-connet", val);
}