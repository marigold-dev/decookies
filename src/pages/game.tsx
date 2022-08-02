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
import { getTotalCps } from '../store/reducer';

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();

    useEffect(() => {
        // declare the data fetching function
        console.log("only one time");
        dispatch(requestInit(dispatch));

    }, [dispatch]);

    const handleCookieClick = () => {
        console.log("Clicked on cookie, mint one");
        dispatch(addCookie(gameState, dispatch));
    }
    const handleCursorClick = () => {
        console.log("Clicked on cursor, mint one");
        dispatch(addCursor(gameState, dispatch));
    }
    const handleGrandmaClick = () => {
        console.log("Clicked on grandma, mint one");
        dispatch(addGrandma(gameState, dispatch));
    }
    const handleFarmClick = () => {
        console.log("Clicked on farm, mint one");
        dispatch(addFarm(gameState, dispatch));
    }


    return <>
        <CookieButton onClick={handleCookieClick} />
        <CookieCounter value={gameState.numberOfCookie} cps={getTotalCps(gameState)} />

        <div>
            <label htmlFor="Cursors">Cursors: </label>
            <ToolCounter value={gameState.numberOfCursor} />
            <ToolButton img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <label htmlFor="cursor_cost">Next cursor cost: </label>
            <ToolCounter value={gameState.cursorCost} />
        </div>
        <div >
            <label htmlFor="Grandmas">Grandmas: </label>
            <ToolCounter value={gameState.numberOfGrandma} />
            <ToolButton img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <label htmlFor="grandma_cost">Next grandma cost:</label>
            <ToolCounter value={gameState.grandmaCost} />
        </div>
        <div >
            <label htmlFor="farms">Farms: </label>
            <ToolCounter value={gameState.numberOfFarm} />
            <ToolButton img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <label htmlFor="farm_cost">Next farm cost: </label>
            <ToolCounter value={gameState.farmCost} />
        </div>
    </>
}
