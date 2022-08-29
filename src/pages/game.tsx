import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';
import mine from '../../resources/mine.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, addMine, saveAddress, saveNodeUri, saveWallet, initState } from '../store/actions';
import { useEffect, useRef } from 'react'
import { state } from '../store/reducer';
import { getTotalCps, isButtonEnabled, buyCursor, buyFarm, buyGrandma, buyMine } from '../store/cookieBaker';
import { InMemorySigner } from '@taquito/signer';
import { ConnectButton } from '../components/buttons/connectWallet';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { NetworkType } from "@airgap/beacon-sdk";

export let userAddress: string;
export let privateKey: string;
export let nodeUri: string;

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();
    const latestState = useRef(gameState);
    latestState.current = gameState;
    // Refs
    const userAddressRef = useRef<HTMLInputElement | null>(null);
    const privateKeyRef = useRef<HTMLInputElement | null>(null);
    const nodeUriRef = useRef<HTMLInputElement | null>(null);


    useEffect(() => {
        if (latestState.current.wallet && latestState.current.address && latestState.current.nodeUri) {
            initState(dispatch, latestState.current.address, latestState.current.nodeUri);
            const id = setInterval(() => {
                if (latestState.current.wallet && latestState.current.address && latestState.current.nodeUri) {
                    const cb = latestState.current.cookieBaker;
                    console.log(cb);
                    const production = getTotalCps(cb);
                    try {
                        addCookie(dispatch, latestState, Number(production))
                    } catch (error) {
                        console.error("big error")
                    }
                }
            }, 1000)
            return () => {
                clearInterval(id);
            };
        }
        return () => { }
    }, [dispatch, latestState.current.wallet]);

    const handleConnection = () => {
        userAddress = userAddressRef.current?.value || "";
        console.log(userAddress);
        dispatch(saveAddress(userAddress));

        privateKey = privateKeyRef.current?.value || "";
        const wallet = new InMemorySigner(privateKey);
        dispatch(saveWallet(wallet));

        nodeUri = nodeUriRef.current?.value || "";
        dispatch(saveNodeUri(nodeUri));
    };

    const handleCookieClick = () => {
            addCookie(dispatch, latestState);
    }
    const handleCursorClick = () => {
            addCursor(dispatch, latestState);
    }
    const handleGrandmaClick = () => {
            addGrandma(dispatch, latestState);
    }
    const handleFarmClick = () => {
            addFarm(dispatch, latestState);
    }
    const handleMineClick = () => {
            addMine(dispatch, latestState);
    }
    const handleBeaconConnection = async () => {
        nodeUri = nodeUriRef.current?.value || "";
        dispatch(saveNodeUri(nodeUri));
        console.log("Je suis appelée");

        const createWallet = (): void => {
            console.log("CreateWallet");
            console.log("je crée un wallet");
            const Tezos = new TezosToolkit("https://mainnet.tezos.marigold.dev/");
            // creates a wallet instance if not exists
            const myWallet = new BeaconWallet({
                name: "decookies",
                preferredNetwork: NetworkType.CUSTOM,
            });

            // regarding the documentation this step is necessary
            Tezos.setWalletProvider(myWallet);
            dispatch(saveWallet(myWallet));
        }
        try {
            if (!latestState.current.wallet) return createWallet();
            if (latestState.current.wallet instanceof BeaconWallet) {
                await latestState.current.wallet.requestPermissions({
                    network: {
                        type: NetworkType.CUSTOM,
                        rpcUrl: "https://mainnet.tezos.marigold.dev/"
                    }
                });
                const address = await latestState.current.wallet.getPKH();
                dispatch(saveAddress(address));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <div>
            <label>
                Public address:
                <input type="text" name="userAddress" ref={userAddressRef} defaultValue="tz1bS3Q3ReR69ne6AaLRpkM45ud85ceX9x7K" />
            </label>
            <label>
                Private key:
                <input type="text" name="privateKey" ref={privateKeyRef} defaultValue="edsk3171aZSpaDRGaSxah3GKnWpjxKz1tToL6PR5mTSaCpjYA1mUs4" />
            </label>
            <label>
                Deku node URI:
                <input type="text" name="nodeUri" ref={nodeUriRef} defaultValue="http://localhost:4440" />
            </label>
            <button onClick={handleConnection}>Connect!</button>
            <div>Hello {gameState.address}</div>
            :
            <ConnectButton onClick={handleBeaconConnection} ></ConnectButton>
        </div>
        <CookieButton disabled={gameState.wallet === null} onClick={handleCookieClick} />
        <CookieCounter value={gameState.cookieBaker.cookies} cps={getTotalCps(gameState.cookieBaker)} />

        <div>
            <label htmlFor="Cursors">Cursors: </label>
            <ToolCounter value={gameState.cookieBaker.cursors} />
            <ToolButton disabled={gameState.wallet === null || !isButtonEnabled(gameState.cookieBaker, buyCursor)} img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <label htmlFor="cursor_cost">Next cursor cost: </label>
            <ToolCounter value={gameState.cookieBaker.cursorCost} />
        </div>
        <div >
            <label htmlFor="Grandmas">Grandmas: </label>
            <ToolCounter value={gameState.cookieBaker.grandmas} />
            <ToolButton disabled={gameState.wallet === null || !isButtonEnabled(gameState.cookieBaker, buyGrandma)} img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <label htmlFor="grandma_cost">Next grandma cost:</label>
            <ToolCounter value={gameState.cookieBaker.grandmaCost} />
        </div>
        <div >
            <label htmlFor="farms">Farms: </label>
            <ToolCounter value={gameState.cookieBaker.farms} />
            <ToolButton disabled={gameState.wallet === null || !isButtonEnabled(gameState.cookieBaker, buyFarm)} img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <label htmlFor="farm_cost">Next farm cost: </label>
            <ToolCounter value={gameState.cookieBaker.farmCost} />
        </div>
        <div >
            <label htmlFor="mines">Mines: </label>
            <ToolCounter value={gameState.cookieBaker.mines} />
            <ToolButton disabled={gameState.wallet === null || !isButtonEnabled(gameState.cookieBaker, buyMine)} img={mine} alt="Buy mine"
                onClick={handleMineClick} />
            <label htmlFor="mine_cost">Next mine cost: </label>
            <ToolCounter value={gameState.cookieBaker.mineCost} />
        </div>
    </>
}
