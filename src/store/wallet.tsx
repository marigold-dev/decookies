
// Setup beacon wallet instance 
import { BeaconWallet } from "@taquito/beacon-wallet";

export const wallet = new BeaconWallet({
    name: "Cookie Game Dapp",
    // preferredNetwork: "ithacanet"
});

// An address is either a string or undefined
let userAddress: string | undefined

// Setup connectWallet function
export const connectWallet = async () => {
    await wallet.requestPermissions({});
    userAddress = await wallet.getPKH();
    console.log("New connection:", userAddress);
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
    } else {
        await wallet.requestPermissions();
        userAddress = await wallet.getPKH();
        console.log("New connection", userAddress);
    }    
}