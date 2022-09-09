import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';
import mine from '../../resources/mine.png';
import factory from '../../resources/factory.png';
import cookie from '../../resources/perfectCookie.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, addMine, saveConfig, saveWallet, initState, clearError, addError, clearMessage, addMessage, addFactory } from '../store/actions';
import { useEffect, useRef } from 'react'
import { state } from '../store/reducer';
import { getTotalCps, isButtonEnabled, buyCursor, buyFarm, buyGrandma, buyMine, buyFactory } from '../store/cookieBaker';
import { ConnectButton } from '../components/buttons/connectWallet';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { NetworkType } from "@airgap/beacon-sdk";

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as ed from '@noble/ed25519';
import crypto from 'crypto-js';

import { PREFIX, toB58Hash } from '../store/utils';

export let nodeUri: string;
export let nickName: string;
export let amount: bigint;

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();
    const latestState = useRef(gameState);
    latestState.current = gameState;
    // Refs
    const nodeUriRef = useRef<HTMLInputElement | null>(null);
    const nicknameRef = useRef<HTMLInputElement | null>(null);

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
        if (latestState.current.message) {
            toast.info(latestState.current.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: false,
                onClose: () => dispatch(clearMessage())
            });
        }
    }, [dispatch, latestState.current.error, latestState.current.message]);

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
    const handleFactoryClick = () => {
        addFactory(dispatch, latestState);
    }
    const handleBeaconConnection = async () => {
        nodeUri = nodeUriRef.current?.value || "";
        nickName = nicknameRef.current?.value || "";

        if (nodeUri && nickName) {
            dispatch(saveConfig(nodeUri, nickName));
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
                    },
                    // Since we generate a random key, we do not need any authorization from the user
                    scopes: []
                });
                // generate random private key to use InMemorySigner
                const privateKey = ed.utils.randomPrivateKey();

                const realPrivateKey = toB58Hash(PREFIX.edsk, ed.utils.bytesToHex(privateKey))
                const encryptedPrivateKey = crypto.AES.encrypt(realPrivateKey, nickName).toString();
                // save private key in the locale storage, to retrieve a game already launched
                localStorage.setItem("privateKey", encryptedPrivateKey);
                const message = "Please save your encrypted privateKey: " + encryptedPrivateKey + "\nand your Nickname: " + nickName + "\nThey will be needed if you want to continue on an other device";
                dispatch(addMessage(message));

            } catch (err) {
                const error_msg = (typeof err === 'string') ? err : (err as Error).message;
                dispatch(addError(error_msg));
                throw new Error(error_msg);
            }
        } else
            dispatch(addError("Need to fulfil Nickname and Node URI"));
    }

    return <>
        <div>
            <ToastContainer />
            <label>
                Nickname:
                <input type="text" name="nickName" ref={nicknameRef} />
            </label>
            <label>
                Deku node URI:
                <input type="text" name="nodeUri" ref={nodeUriRef} defaultValue="http://localhost:4440" />
            </label>
            <ConnectButton onClick={handleBeaconConnection}></ConnectButton>
        </div>
        <CookieButton disabled={gameState.wallet === null} onClick={handleCookieClick} />
        <CookieCounter value={gameState.cookieBaker.cookies} cps={getTotalCps(gameState.cookieBaker)} />
        <div className='content'>
            <div className='wrapper'>
                <ToolButton disabled={!isButtonEnabled(gameState.cookieBaker, buyCursor)} img={cursor} alt="Buy cursor"
                    onClick={handleCursorClick} />
                <section className="items">
                    <div>
                        <label htmlFor="Cursors">Cursors: </label>
                        <ToolCounter value={gameState.cookieBaker.cursors} />
                    </div>
                    <div>
                        <img src={cookie} className="money" alt="Money"></img>
                        <label htmlFor="cursor_cost"> Price: </label>
                        <ToolCounter value={gameState.cookieBaker.cursorCost} />
                    </div>
                </section>
            </div>
            <div className='wrapper'>
                <ToolButton disabled={!isButtonEnabled(gameState.cookieBaker, buyGrandma)} img={grandma} alt="Buy grandma"
                    onClick={handleGrandmaClick} />
                <section className="items">
                    <div>
                        <label htmlFor="Grandmas">Grandmas: </label>
                        <ToolCounter value={gameState.cookieBaker.grandmas} />
                    </div>
                    <div>
                        <img src={cookie} className="money" alt="Money"></img>
                        <label htmlFor="grandma_cost"> Price: </label>
                        <ToolCounter value={gameState.cookieBaker.grandmaCost} />
                    </div>
                </section>
            </div>
            <div className='wrapper'>
                <ToolButton disabled={!isButtonEnabled(gameState.cookieBaker, buyFarm)} img={farm} alt="Buy farm"
                    onClick={handleFarmClick} />
                <section className="items">
                    <div>
                        <label htmlFor="farms">Farms: </label>
                        <ToolCounter value={gameState.cookieBaker.farms} />
                    </div>
                    <div>
                        <img src={cookie} className="money" alt="Money"></img>
                        <label htmlFor="farm_cost"> Price: </label>
                        <ToolCounter value={gameState.cookieBaker.farmCost} />
                    </div>
                </section>
            </div>
            <div className='wrapper'>
                <ToolButton disabled={!isButtonEnabled(gameState.cookieBaker, buyMine)} img={mine} alt="Buy mine"
                    onClick={handleMineClick} />
                <section className="items">
                    <div>
                        <label htmlFor="mines">Mines: </label>
                        <ToolCounter value={gameState.cookieBaker.mines} />
                    </div>
                    <div>
                        <img src={cookie} className="money" alt="Money"></img>
                        <label htmlFor="mine_cost">Price: </label>
                        <ToolCounter value={gameState.cookieBaker.mineCost} />
                    </div>
                </section>
            </div>
            <div className='wrapper'>
                <ToolButton disabled={!isButtonEnabled(gameState.cookieBaker, buyFactory)} img={factory} alt="Buy factory"
                    onClick={handleFactoryClick} />
                <section className="items">
                    <div>
                        <label htmlFor="factories">Factories: </label>
                        <ToolCounter value={gameState.cookieBaker.factories} />
                    </div>
                    <div>
                        <img src={cookie} className="money" alt="Money"></img>
                        <label htmlFor="factory_cost">Price: </label>
                        <ToolCounter value={gameState.cookieBaker.factoryCost} />
                    </div>
                </section>
            </div>
        </div>
    </>
}
