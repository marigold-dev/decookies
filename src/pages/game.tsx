import cursor from '../../resources/cursor.png';
import farm from '../../resources/farm.png';
import grandma from '../../resources/grandma.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { NetworkType } from '@airgap/beacon-types';
import { BeaconWallet } from '@taquito/beacon-wallet';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {  state } from '../store/actions';
import { buyCursor, buyFarm, buyGrandma, mint } from '../store/reducer';
import { getActualState, getTotalCps, isButtonEnabled } from '../store/utils';
import { TezosToolkit } from '@taquito/taquito';


type ConnectWalletProps = {
    account : string;
    setAccount: Dispatch<SetStateAction<string>>;
    wallet : BeaconWallet;
}


export const ConnectWallet =  ({
    account,
    setAccount,
    wallet
}: ConnectWalletProps): JSX.Element  => {
 
    // Create onConnectWallet function
    const onConnectWallet = async () : Promise<void>=> {
        console.log("onConnectWallet");
        await wallet.requestPermissions({
            network: { type: NetworkType.ITHACANET } 
        });
        account = await wallet.getPKH();
        setAccount(account);
        console.log("New connection:", account);
    };
    

    return <>
      <div className="navbar navbar-dark bg-dark fixed-top">
      <div className="container py-2">
            Cookie Game
      <div className="d-flex">
         {/* Call connectWallet function onClick  */}
        <button onClick={onConnectWallet} className="btn btn-outline-info">
         {/* Show account address if wallet is connected */}
         {account ? account : "Connect Wallet"}
        </button>
      </div>
      </div>
      </div>
    </>
}

type GameProps = {
    account : string;
    wallet : BeaconWallet;
    deku : state;
    setDeku : Dispatch<SetStateAction<state>>;
    tezos: TezosToolkit;
}


export const Game = ({
    account,
    wallet,
    deku,
    setDeku,
    tezos
}: GameProps): JSX.Element  => {


    React.useEffect(() => { (async () => {
          // declare the data fetching function
          setDeku(await getActualState(account));
      })();
    }, []);

    const handleCookieClick = async() => {
        mint("cookie",account,wallet,tezos);
        setDeku(await getActualState(account));
    }
    const handleCursorClick = async() => {
        mint("cursor",account,wallet,tezos);
        setDeku(await getActualState(account));
    }
    const handleGrandmaClick = async() => {
        mint("grandma",account,wallet,tezos);
        setDeku(await getActualState(account));
    }
    const handleFarmClick = async() => {
        mint("farm",account,wallet,tezos);
        setDeku(await getActualState(account));
    }

    return <>
        
        <CookieButton onClick={handleCookieClick} />
        <CookieCounter value={deku.numberOfCookie} cps={getTotalCps(deku)} />

        <div>
            <label htmlFor="Cursors">Cursors: </label>
            <ToolCounter value={deku.numberOfCursor} />
            <ToolButton disabled={!isButtonEnabled(deku, buyCursor)} img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <label htmlFor="cursor_cost">Next cursor cost: </label>
            <ToolCounter value={deku.cursorCost} />
        </div>

        <div >
            <label htmlFor="Grandmas">Grandmas: </label>
            <ToolCounter value={deku.numberOfGrandma} />
            <ToolButton disabled={!isButtonEnabled(deku, buyGrandma)} img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <label htmlFor="grandma_cost">Next grandma cost:</label>
            <ToolCounter value={deku.grandmaCost} />
        </div>

        <div >
            <label htmlFor="farms">Farms: </label>
            <ToolCounter value={deku.numberOfFarm} />
            <ToolButton disabled={!isButtonEnabled(deku, buyFarm)} img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <label htmlFor="farm_cost">Next farm cost: </label>
            <ToolCounter value={deku.farmCost} />
        </div>
    </>
}
