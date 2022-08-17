import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';
import mine from '../../resources/mine.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';
import { ConnectButton } from '../components/buttons/connectWallet';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookie, addFarm, addGrandma, addCursor, addMine, setWallet, setAddress } from '../store/actions';
import { useEffect } from 'react'
import { buyCursor, buyGrandma, buyFarm, buyMine } from '../store/reducer';
import { cookieBaker, getTotalCps, isButtonEnabled } from '../store/cookieBaker';

export let userAddress: string;
export let privateKey: string;
export let nodeUri: string;

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState: cookieBaker = useGame();

    useEffect(() => {
        // No fetch is done here
        // Since the first action is to retrieve the values from the form
        // dispatch requestInit will be done when user clicked on submit
    }, [dispatch]);

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
    const handleMineClick = () => {
        dispatch(addMine(dispatch));
    }
    const myWallet = gameState.wallet;
    console.log(myWallet);
    return <>
        <div>
            {
                (gameState.address) ?
                    <div>Hello ${gameState.address}</div>
                    :
                    <ConnectButton dispatch={dispatch} rpc="" setWallet={setWallet} setAddress={setAddress} wallet={gameState?.wallet} ></ConnectButton>
            }
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
        <div >
            <label htmlFor="mines">Mines: </label>
            <ToolCounter value={gameState.mines} />
            <ToolButton disabled={!isButtonEnabled(gameState, buyMine)} img={mine} alt="Buy mine"
                onClick={handleMineClick} />
            <label htmlFor="mine_cost">Next mine cost: </label>
            <ToolCounter value={gameState.mineCost} />
        </div>
    </>
}
