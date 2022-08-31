import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';
import money from '../../resources/money.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, requestInit, state } from '../store/actions';
import { useEffect } from 'react'
import { getTotalCps, isButtonEnabled, buyCursor, buyGrandma, buyFarm } from '../store/reducer';
import { ResetButton } from '../components/buttons/reset';

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
    const handleResetClick = () => {
       window.location.reload();
    }


    return <>
        <CookieButton onClick={handleCookieClick} />
        <ResetButton onClick ={handleResetClick }></ResetButton>
        <CookieCounter value={gameState.numberOfCookie} cps={getTotalCps(gameState)} />
        <div className='content'>
        <div className='wrapper'>
            <ToolButton disabled={!isButtonEnabled(gameState, buyCursor)} img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <section className="items">
                <div>
                    <label htmlFor="Cursors">Cursors: </label>
                    <ToolCounter value={gameState.numberOfCursor} />
                </div>
                <div>
                    <img src={money} className="money" alt="Money"></img>
                    <label htmlFor="cursor_cost"> Price: </label>
                    <ToolCounter value={gameState.cursorCost} />
                </div>
            </section>
        </div>
        <div className='wrapper'>
            <ToolButton disabled={!isButtonEnabled(gameState, buyGrandma)} img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <section className="items">
                <div>
                    <label htmlFor="Grandmas">Grandmas: </label>
                    <ToolCounter value={gameState.numberOfGrandma} />
                </div>
                <div>
                    <img src={money} className="money" alt="Money"></img>
                    <label htmlFor="cursor_cost"> Price: </label>
                    <ToolCounter value={gameState.grandmaCost} />
                </div>
            </section>
        </div>
        <div  className='wrapper'>
             <ToolButton disabled={!isButtonEnabled(gameState, buyFarm)} img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <section className="items">
                <div>
                    <label htmlFor="farms">Farms: </label>
                    <ToolCounter value={gameState.numberOfFarm} />
                </div>
                <div>
                    <img src={money} className="money" alt="Money"></img>
                    <label htmlFor="cursor_cost"> Price: </label>
                    <ToolCounter value={gameState.farmCost} />
                </div>
            </section>
        </div>
        </div>
    </>
}
