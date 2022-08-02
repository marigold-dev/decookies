import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookies, addFarms, addGrandmas, addCursors, requestInit, state } from '../store/actions';
import { useEffect } from 'react'
import { getTotalCps } from '../store/reducer';

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: state = useGame();
    let passiveMintCursor = 0;
    let passiveMintGrandma = 0;
    let passiveMintFarm = 0;

    useEffect(() => {
        // declare the data fetching function
        console.log("only one time");
        dispatch(requestInit(dispatch));


    }, []);

    const handleCookieClick = () => {
        dispatch(addCookies(gameState, dispatch));
    }
    const handleCursorClick = () => {
        dispatch(addCursors(gameState, dispatch));
        passiveMintCursor += 1;
        if (passiveMintCursor === 1) {
            const interval = setInterval(() => {
                for (let i = 0; i <= (gameState.cursorCps); i++) {
                    console.log("Mint from cursor")
                    dispatch(addCookies(gameState, dispatch));
                }
            }, 10000);
            return () => {
                clearInterval(interval);
            }
        }
    }
    const handleGrandmaClick = () => {
        dispatch(addGrandmas(gameState, dispatch));
        passiveMintGrandma += 1;
        if (passiveMintGrandma === 1) {
            const interval = setInterval(() => {
                for (let i = 0; i <= (gameState.grandmaCps); i++) {
                    console.log("Mint from grandmas")
                    dispatch(addCookies(gameState, dispatch));
                }
            }, 1000);
            return () => {
                clearInterval(interval);
            }
        }
    }
    const handleFarmClick = () => {
        dispatch(addFarms(gameState, dispatch));
        passiveMintFarm += 1;
        if (passiveMintFarm === 1) {
            const interval = setInterval(() => {
                for (let i = 0; i <= (gameState.farmCps); i++) {
                    console.log("Mint from farms")
                    dispatch(addCookies(gameState, dispatch));
                }
            }, 1000);
            return () => {
                clearInterval(interval);
            }
        }
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