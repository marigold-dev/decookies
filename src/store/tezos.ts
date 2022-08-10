import { TezosToolkit } from '@taquito/taquito';
import { wallet } from "./wallet"

// TEZOS connect to wallet network ex: ithacanet 
// https://tezostaquito.io/docs/rpc_nodes/
export const tezos = new TezosToolkit("https://ithacanet.tezos.marigold.dev/");

// Specify wallet provider for Tezos instance 
tezos.setWalletProvider(wallet);