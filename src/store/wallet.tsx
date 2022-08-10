// Setup beacon wallet instance 
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Signer } from "@taquito/taquito";
import { NetworkType } from "@airgap/beacon-types"

export const wallet = new BeaconWallet({
    name: "Cookie Game Dapp",
    // Change the network if prefer
    preferredNetwork: NetworkType.ITHACANET,
});

let userAddress: string | undefined

// Setup connectWallet function
export const connectWallet = async () => {
    await wallet.requestPermissions({network: { type: NetworkType.ITHACANET } });
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
        await wallet.clearActiveAccount();
        await connectWallet();
    }
}

// Implement ReadOnlySigner from Signer interface
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