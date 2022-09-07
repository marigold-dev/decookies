import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';
import mine from '../../resources/mine.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, addMine, saveNodeUri, saveWallet, initState, clearError, addError } from '../store/actions';
import { useEffect, useRef } from 'react'
import { state } from '../store/reducer';
import { getTotalCps, isButtonEnabled, buyCursor, buyFarm, buyGrandma, buyMine } from '../store/cookieBaker';
import { ConnectButton } from '../components/buttons/connectWallet';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { NetworkType } from "@airgap/beacon-sdk";

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as ed from '@noble/ed25519';
import { PREFIX, toB58Hash } from '../store/utils';

export let nodeUri: string;

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();
    const latestState = useRef(gameState);
    latestState.current = gameState;
    // Refs
    const nodeUriRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (latestState.current.wallet && latestState.current.nodeUri) {
            initState(dispatch, latestState.current.nodeUri);
            const id = setInterval(() => {
                if (latestState.current.wallet && latestState.current.nodeUri) {
                    const cb = latestState.current.cookieBaker;
                    const production = getTotalCps(cb);
                    try {
                        addCookie(dispatch, latestState, Number(production))
                    } catch (err) {
                        const error_msg = (typeof err === 'string') ? err : (err as Error).message;
                        dispatch(addError(error_msg));
                        throw new Error(error_msg);
                    }
                }
            }, 1000)
            return () => {
                clearInterval(id);
            };
        }
        return () => { }
    }, [dispatch, latestState.current.wallet]);

    useEffect(() => {
        if (latestState.current.error) {
            toast.error(latestState.current.error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                onClose: () => dispatch(clearError())
            });
        }
    }, [dispatch, latestState.current.error]);

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

        const createWallet = (): void => {
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
            await latestState.current.wallet.requestPermissions({
                network: {
                    type: NetworkType.CUSTOM,
                    rpcUrl: "https://mainnet.tezos.marigold.dev/"
                }
            });
            // generate random private key to use InMemorySigner
            const privateKey = ed.utils.randomPrivateKey();

            const realPrivateKey = toB58Hash(PREFIX.edsk, ed.utils.bytesToHex(privateKey))
            console.log("set privateKey: ", realPrivateKey);
            // save private key in the locale storage, to retrieve a game already launched
            localStorage.setItem("privateKey", realPrivateKey);

        } catch (err) {
            const error_msg = (typeof err === 'string') ? err : (err as Error).message;
            dispatch(addError(error_msg));
            throw new Error(error_msg);
        }
    }

    return <>
        <div>
            <ToastContainer />
            <label>
                Deku node URI:
                <input type="text" name="nodeUri" ref={nodeUriRef} defaultValue="http://localhost:4440" />
            </label>
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
