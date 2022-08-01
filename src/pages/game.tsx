import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookies, addFarms, addGrandmas, addCursors, request_init } from '../store/actions';
import { useEffect } from "react"

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState = useGame();
    let passive_mint_cursor = 0;
    let passive_mint_grandma = 0;
    let passive_mint_farm = 0;

    useEffect(() => {
        // declare the data fetching function
        console.log("only one time");
        dispatch(request_init(dispatch));


    }, []);

    const handleCookieClick = () => {
        dispatch(addCookies(gameState, dispatch));
    }
    const handleCursorClick = () => {
        dispatch(addCursors(gameState, dispatch));
        passive_mint_cursor += 1;
        if (passive_mint_cursor === 1) {
            const interval = setInterval(() => {
                for (let i = 0; i <= (gameState.cursor_cps); i++) {
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
        passive_mint_grandma += 1;
        if (passive_mint_grandma === 1) {
            const interval = setInterval(() => {
                for (let i = 0; i <= (gameState.grandma_cps); i++) {
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
        passive_mint_farm += 1;
        if (passive_mint_farm === 1) {
            const interval = setInterval(() => {
                for (let i = 0; i <= (gameState.farm_cps); i++) {
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
        <CookieCounter value={gameState.number_of_cookie} cps={gameState.farm_cps + gameState.cursor_cps + gameState.grandma_cps} />

        <div>
            <label htmlFor="Cursors">Cursors: </label>
            <ToolCounter value={gameState.number_of_cursor} />
            <ToolButton img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <label htmlFor="cursor_cost">Next cursor cost: </label>
            <ToolCounter value={gameState.cursor_cost} />
        </div>
        <div >
            <label htmlFor="Grandmas">Grandmas: </label>
            <ToolCounter value={gameState.number_of_grandma} />
            <ToolButton img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <label htmlFor="grandma_cost">Next grandma cost:</label>
            <ToolCounter value={gameState.grandma_cost} />
        </div>
        <div >
            <label htmlFor="farms">Farms: </label>
            <ToolCounter value={gameState.number_of_farm} />
            <ToolButton img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <label htmlFor="farm_cost">Next farm cost: </label>
            <ToolCounter value={gameState.farm_cost} />
        </div>
    </>
}