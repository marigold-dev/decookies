import { TezosToolkit } from '@taquito/taquito';
import { wallet } from "./wallet"

// TEZOS connect to wallet: todo add the network ex: ithacanet 
export const tezos = new TezosToolkit("https://jakartanet.smartpy.io");

// Specify wallet provider for Tezos instance 
tezos.setWalletProvider(wallet);