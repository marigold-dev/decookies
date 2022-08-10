import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, requestInit, state } from '../store/actions';
import { useEffect } from 'react'
import { getTotalCps, isButtonEnabled } from '../store/utils';
import { buyCursor, buyGrandma, buyFarm } from '../store/reducer';

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();

    useEffect(() => {
        // declare the data fetching function
        dispatch(requestInit(dispatch));

    }, [dispatch]);

    const handleCookieClick = () => {
        dispatch(addCookie(gameState, dispatch));
    }
    const handleCursorClick = () => {
        dispatch(addCursor(gameState, dispatch));
    }
    const handleGrandmaClick = () => {
        dispatch(addGrandma(gameState, dispatch));
    }
    const handleFarmClick = () => {
        dispatch(addFarm(gameState, dispatch));
    }

    return <>
        <CookieButton onClick={handleCookieClick} />
        <CookieCounter value={gameState.numberOfCookie} cps={getTotalCps(gameState)} />

        <div>
            <label htmlFor="Cursors">Cursors: </label>
            <ToolCounter value={gameState.numberOfCursor} />
            <ToolButton disabled={!isButtonEnabled(gameState, buyCursor)} img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <label htmlFor="cursor_cost">Next cursor cost: </label>
            <ToolCounter value={gameState.cursorCost} />
        </div>

        <div >
            <label htmlFor="Grandmas">Grandmas: </label>
            <ToolCounter value={gameState.numberOfGrandma} />
            <ToolButton disabled={!isButtonEnabled(gameState, buyGrandma)} img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <label htmlFor="grandma_cost">Next grandma cost:</label>
            <ToolCounter value={gameState.grandmaCost} />
        </div>
        
        <div >
            <label htmlFor="farms">Farms: </label>
            <ToolCounter value={gameState.numberOfFarm} />
            <ToolButton disabled={!isButtonEnabled(gameState, buyFarm)} img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <label htmlFor="farm_cost">Next farm cost: </label>
            <ToolCounter value={gameState.farmCost} />
        </div>
    </>
}
