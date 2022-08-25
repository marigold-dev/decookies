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

export let userAddress: string;
export let privateKey: string;
export let nodeUri: string;

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();
    const latestState = useRef(gameState);

    // Refs
    const userAddressRef = useRef<HTMLInputElement | null>(null);
    const privateKeyRef = useRef<HTMLInputElement | null>(null);
    const nodeUriRef = useRef<HTMLInputElement | null>(null);


    useEffect(() => {
        if (latestState.current.wallet) {
            initState(dispatch);
            const id = setInterval(() => {
                const cb = latestState.current.cookieBaker;
                const production = getTotalCps(cb);
                addCookie(dispatch, latestState.current, production)
            }, 1000)
            return () => {
                clearInterval(id);
            };
        }
        return () => { }
    }, [dispatch]);

    const handleConnection = () => {
        userAddress = userAddressRef.current?.value || "";
        dispatch(saveAddress(userAddress));

        privateKey = privateKeyRef.current?.value || "";
        const wallet = new InMemorySigner(privateKey);
        dispatch(saveWallet(wallet));

        nodeUri = nodeUriRef.current?.value || "";
        dispatch(saveNodeUri(nodeUri));
    };

    const handleCookieClick = () => {
        addCookie(dispatch, gameState);
    }
    const handleCursorClick = () => {
        addCursor(dispatch, gameState);
    }
    const handleGrandmaClick = () => {
        addGrandma(dispatch, gameState);
    }
    const handleFarmClick = () => {
        addFarm(dispatch, gameState);
    }
    const handleMineClick = () => {
        addMine(dispatch, gameState);
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
