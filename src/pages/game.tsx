import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';
import mine from '../../resources/mine.png';
import factory from '../../resources/factory.png';
import cookie from '../../resources/perfectCookie.png';
import transfer from '../../resources/transfer.png';
import eat from '../../resources/eatcookie.png'

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, addMine, saveConfig, initState, clearError, addError, clearMessage, addFactory, saveGeneratedKeyPair, eatCookie, transferCookie, saveWallet, updateOven, updateCursorBasket, updateRecruitingGrandmas, updateBuildingFarms, updateDrillingMines, updateBuildingFactories } from '../store/actions';
import { useEffect, useRef } from 'react'
import { state } from '../store/reducer';
import { isButtonEnabled, buyCursor, buyFarm, buyGrandma, buyMine, buyFactory } from '../store/cookieBaker';
import { ConnectButton } from '../components/buttons/connectWallet';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { NetworkType, PermissionScope, SigningType } from "@airgap/beacon-sdk";

import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as human from 'human-crypto-keys'

import { getKeyPair, stringToHex } from '../store/utils';
import { leaderBoard } from '../store/vmTypes';

export let nodeUri: string;
export let nickName: string;
export let amountToTransfer: string;
export let transferRecipient: string;
export let amountToEat: string;

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();
    const latestState = useRef(gameState);
    latestState.current = gameState;
    // Refs
    const nodeUriRef = useRef<HTMLInputElement | null>(null);
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    const amountToTransferRef = useRef<HTMLInputElement | null>(null);
    const transferRecipientRef = useRef<HTMLInputElement | null>(null);
    const amountToEatRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (latestState.current.wallet && latestState.current.nodeUri) {
            initState(dispatch, latestState.current.nodeUri, latestState.current.generatedKeyPair);
            const id = setInterval(() => {
                if (latestState.current.wallet && latestState.current.nodeUri) {
                    const cb = latestState.current.cookieBaker;
                    const production = cb.passiveCPS;
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
        //TODO: here?
        const pending = latestState.current.cookiesInOven + 1n;
        dispatch(updateOven(pending));
        addCookie(dispatch, latestState);
    }
    const handleCursorClick = () => {
        //TODO: here?
        const pending = latestState.current.cursorsInBasket + 1n;
        dispatch(updateCursorBasket(pending));
        addCursor(dispatch, latestState);
    }
    const handleGrandmaClick = () => {
        const pending = latestState.current.recruitingGrandmas + 1n;
        dispatch(updateRecruitingGrandmas(pending));
        addGrandma(dispatch, latestState);
    }
    const handleFarmClick = () => {
        const pending = latestState.current.buildingFarms + 1n;
        dispatch(updateBuildingFarms(pending));
        addFarm(dispatch, latestState);
    }
    const handleMineClick = () => {
        const pending = latestState.current.drillingMines + 1n;
        dispatch(updateDrillingMines(pending));
        addMine(dispatch, latestState);
    }
    const handleFactoryClick = () => {
        const pending = latestState.current.buildingFactories + 1n;
        dispatch(updateBuildingFactories(pending));
        addFactory(dispatch, latestState);
    }
    const handleTransferClick = () => {
        amountToTransfer = amountToTransferRef.current?.value || "";
        transferRecipient = transferRecipientRef.current?.value || "";
        if (amountToTransfer && transferRecipient) {
            try {
                transferCookie(transferRecipient, amountToTransfer, dispatch, latestState)
            } catch (err) {
                const error_msg = (typeof err === 'string') ? err : (err as Error).message;
                dispatch(addError(error_msg));
                throw new Error(error_msg);
            }
        }
    }
    const handleEatClick = () => {
        amountToEat = amountToEatRef.current?.value || "";
        if (amountToEat) {
            try {
                eatCookie(amountToEat, dispatch, latestState);
            } catch (err) {
                const error_msg = (typeof err === 'string') ? err : (err as Error).message;
                dispatch(addError(error_msg));
                throw new Error(error_msg);
            }
        }
    }
    const handleBeaconConnection = async () => {
        nodeUri = nodeUriRef.current?.value || "";
        nickName = nicknameRef.current?.value || "";
        dispatch(updateOven(0n));
        dispatch(updateCursorBasket(0n));
        dispatch(updateRecruitingGrandmas(0n));
        dispatch(updateBuildingFarms(0n));
        dispatch(updateDrillingMines(0n));
        dispatch(updateBuildingFactories(0n));

        if (nodeUri && nickName) {
            dispatch(saveConfig(nodeUri, nickName));
            const createWallet = (): BeaconWallet => {
                const Tezos = new TezosToolkit("https://mainnet.tezos.marigold.dev/");
                // creates a wallet instance if not exists
                const myWallet = new BeaconWallet({
                    name: "decookies",
                    preferredNetwork: NetworkType.CUSTOM,
                });

                // regarding the documentation this step is necessary
                Tezos.setWalletProvider(myWallet);
                return myWallet;
            }
            try {
                const wallet = latestState.current.wallet ? latestState.current.wallet : createWallet();
                await wallet.requestPermissions({
                    network: {
                        type: NetworkType.CUSTOM,
                        rpcUrl: "https://mainnet.tezos.marigold.dev/"
                    },
                    // Only neede to sign the chosen nickname
                    scopes: [PermissionScope.SIGN]
                });

                // sign the chosen nickname
                const seed = await wallet.client.requestSignPayload({
                    signingType: SigningType.RAW, payload: stringToHex(nickName)
                }).then(val => val.signature);

                // get keyPair
                const rawKeyPair = await human.getKeyPairFromSeed(seed.toString(), "ed25519");
                const keyPair = getKeyPair(rawKeyPair);
                // save them in state to use them at each needed action
                dispatch(saveGeneratedKeyPair(keyPair))
                dispatch(saveWallet(wallet));
            } catch (err) {
                const error_msg = (typeof err === 'string') ? err : (err as Error).message;
                dispatch(addError(error_msg));
                throw new Error(error_msg);
            }
        } else
            dispatch(addError("Need to fulfil Nickname and Node URI"));
    }

    const getRandomBetaNode = () => {
        if (!latestState.current.nodeUri) {
            //TODO: should always reach the same URI, load-balancing must be done on infra side!
            const node = Math.floor(Math.random() * 4);
            return "https://deku-betanet-vm" + node + ".deku-v1.marigold.dev"
        }
        return ""
    }

    return <>
        <ToastContainer />
        <div>
            <label>
                Nickname:
                <input type="text" name="nickName" ref={nicknameRef} />
            </label>
            <label>
                Deku node URI:
                <input type="text" name="nodeUri" ref={nodeUriRef} defaultValue={getRandomBetaNode()} />
            </label>
            <ConnectButton onClick={handleBeaconConnection}></ConnectButton>
        </div>
        <div>
            <label hidden={!latestState.current.publicAddress}>
                Hello {latestState.current.publicAddress}
            </label>
        </div>
        <CookieButton disabled={gameState.wallet === null} onClick={handleCookieClick} />
        <div>
            <label htmlFor="cursor_cost"> Cookies in oven: </label>
            <ToolCounter value={gameState.cookiesInOven} />
            <CookieCounter value={gameState.cookieBaker.cookies} cps={gameState.cookieBaker.passiveCPS} />
        </div>
        <div className='content'>
            <div className='wrapper'>
                <ToolButton disabled={!isButtonEnabled(gameState, buyCursor)} img={cursor} alt="Buy cursor"
                    onClick={handleCursorClick} />
                <section className="items">
                    <div>
                        <div>
                            <label htmlFor="cursor_basket"> Cursor(s) in delivery: </label>
                            <ToolCounter value={gameState.cursorsInBasket} />
                        </div>
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
                <ToolButton disabled={!isButtonEnabled(gameState, buyGrandma)} img={grandma} alt="Buy grandma"
                    onClick={handleGrandmaClick} />
                <section className="items">
                    <div>
                        <div>
                            <label htmlFor="recruiting_grandma"> Grandma(s) in job interview: </label>
                            <ToolCounter value={gameState.recruitingGrandmas} />
                        </div>
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
                <ToolButton disabled={!isButtonEnabled(gameState, buyFarm)} img={farm} alt="Buy farm"
                    onClick={handleFarmClick} />
                <section className="items">
                    <div>
                        <div>
                            <label htmlFor="building_farms"> Farm(s) under construction: </label>
                            <ToolCounter value={gameState.buildingFarms} />
                        </div>
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
                <ToolButton disabled={!isButtonEnabled(gameState, buyMine)} img={mine} alt="Buy mine"
                    onClick={handleMineClick} />
                <section className="items">
                    <div>
                        <div>
                            <label htmlFor="drilling_mine"> Drilling Mine(s): </label>
                            <ToolCounter value={gameState.drillingMines} />
                        </div>
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
                <ToolButton disabled={!isButtonEnabled(gameState, buyFactory)} img={factory} alt="Buy factory"
                    onClick={handleFactoryClick} />
                <section className="items">
                    <div>
                        <div>
                            <label htmlFor="building_factories"> Building factory(ies): </label>
                            <ToolCounter value={gameState.buildingFactories} />
                        </div>
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
        <div>
            <div>
                <label>
                    Transfer:&nbsp;
                    <input type="text" name="amount" ref={amountToTransferRef} />
                    &nbsp; cookies &nbsp;
                </label>
                <label>
                    to:&nbsp;
                    <input type="text" name="recipient" ref={transferRecipientRef} />
                </label>
                <ToolButton disabled={false} img={transfer} alt="transfer" onClick={handleTransferClick} />
            </div>
            <div>
                <label>
                    Eat:&nbsp;
                    <input type="text" name="amountToEat" ref={amountToEatRef} />
                    cookies&nbsp;
                </label>
                <ToolButton disabled={false} img={eat} alt="eat" onClick={handleEatClick} />
            </div>
        </div>
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Rank</th>
                        <th>Address</th>
                        <th>Eaten cookies</th>
                    </tr>
                    {gameState.leaderBoard.map((item: leaderBoard, i: any) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.address}</td>
                            <td>{item.eatenCookies.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}
