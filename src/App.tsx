import { NetworkType } from '@airgap/beacon-types';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { useEffect, useState } from 'react';
import './App.css';

import { Game, ConnectWallet } from './pages/game';
import { state } from './store/actions';



const App = () => {
  
  const [account, setAccount] = useState<string>("");
  const [wallet,setWallet] = useState<BeaconWallet>();
  const [tezos,setTezos] =  useState<TezosToolkit>();
  const [deku,setDeku] = useState<state>({
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
    farmCps: 0
});
  
  // Specify wallet provider for Tezos instance 
  
  useEffect(() => {
    let tezos = new TezosToolkit("https://ithacanet.tezos.marigold.dev/");
    let wallet = new BeaconWallet({
      name: "Cookie Game Dapp",
      // Change the network if prefer
      preferredNetwork: NetworkType.ITHACANET,
    })
    setWallet(wallet);
    tezos.setWalletProvider(wallet);
    setTezos(tezos);
  } , []);
  
  
  return <div className="App">
  <ConnectWallet 
  account={account}
  setAccount={setAccount}
  wallet={wallet}
  />
  <Game 
  account={account}
  wallet={wallet}
  deku={deku}
  setDeku={setDeku}
  tezos={tezos}
  />
  </div>
  ;
}
export default App;
