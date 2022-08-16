import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, requestInit } from '../store/actions';
import { useEffect, useRef } from 'react'
import { buyCursor, buyGrandma, buyFarm } from '../store/reducer';
import { cookieBaker, getTotalCps, isButtonEnabled } from '../store/cookieBaker';

export let userAddress: string;
export let privateKey: string;
export let nodeUri: string;

export const Game = () => {
    const userAddressRef = useRef(null);
    const privateKeyRef = useRef(null);
    const nodeUriRef = useRef(null);
    const dispatch = useGameDispatch();
    const gameState: cookieBaker = useGame();

    useEffect(() => {
        // No fetch is done here
        // Since the first action is to retrieve the values from the form
        // dispatch requestInit will be done when user clicked on submit
    }, [dispatch]);

    const handleSubmitClick = () => {
        userAddress = userAddressRef.current.value;
        privateKey = privateKeyRef.current.value;
        nodeUri = nodeUriRef.current.value;
        dispatch(requestInit(dispatch));
    };

    const handleCookieClick = () => {
        dispatch(addCookie(dispatch));
    }
    const handleCursorClick = () => {
        dispatch(addCursor(dispatch));
    }
    const handleGrandmaClick = () => {
        dispatch(addGrandma(dispatch));
    }
    const handleFarmClick = () => {
        dispatch(addFarm(dispatch));
    }

    return <>
        <div>
            <label>
                Public address:
                <input type="text" name="userAddress" ref={userAddressRef} />
            </label>
            <label>
                Private key:
                <input type="text" name="privateKey" ref={privateKeyRef} />
            </label>
            <label>
                Deku node URI:
                <input type="text" name="nodeUri" ref={nodeUriRef} defaultValue="http://localhost:4440" />
            </label>
            <button onClick={handleSubmitClick}>Save!</button>
        </div>
        <CookieButton onClick={handleCookieClick} />
        <CookieCounter value={gameState.cookies} cps={getTotalCps(gameState)} />

        <div>
            <label htmlFor="Cursors">Cursors: </label>
            <ToolCounter value={gameState.cursors} />
            <ToolButton disabled={!isButtonEnabled(gameState, buyCursor)} img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <label htmlFor="cursor_cost">Next cursor cost: </label>
            <ToolCounter value={gameState.cursorCost} />
        </div>
        <div >
            <label htmlFor="Grandmas">Grandmas: </label>
            <ToolCounter value={gameState.grandmas} />
            <ToolButton disabled={!isButtonEnabled(gameState, buyGrandma)} img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <label htmlFor="grandma_cost">Next grandma cost:</label>
            <ToolCounter value={gameState.grandmaCost} />
        </div>
        <div >
            <label htmlFor="farms">Farms: </label>
            <ToolCounter value={gameState.farms} />
            <ToolButton disabled={!isButtonEnabled(gameState, buyFarm)} img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <label htmlFor="farm_cost">Next farm cost: </label>
            <ToolCounter value={gameState.farmCost} />
        </div>
    </>
}
