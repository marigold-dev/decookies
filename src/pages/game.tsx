import cursor from '../../resources/cursor.png';
import grandma from '../../resources/grandma.png';
import farm from '../../resources/farm.png';

import { CookieButton } from '../components/buttons/cookie';
import { ToolButton } from '../components/buttons/tool';
import { CookieCounter } from '../components/counters/cookie';
import { ToolCounter } from '../components/counters/tool';

import { useGameDispatch, useGame } from '../store/provider';
import { addCookies, addFarms, addGrandmas, addCursors } from '../store/actions';

const address = "";
const privateKey = "";
const nodeUri = 'http://localhost:4440/';

export const Game = () => {
    const dispatch = useGameDispatch();
    const gameState = useGame();

    const handleCookieClick = () => { dispatch(addCookies(1)) }
    const handleGrandmaClick = () => { dispatch(addGrandmas(1)) }
    const handleFarmClick = () => { dispatch(addFarms(1)) }
    const handleCursorClick = () => { dispatch(addCursors(1)) }

    return <>
        <CookieButton onClick={handleCookieClick} />
        <CookieCounter value={gameState.cookies} cps={1}></CookieCounter>

        <div>
            <label htmlFor="Cursors">Cursors: </label>
            <ToolCounter value={gameState.cursors} />
            <ToolButton img={cursor} alt="Buy cursor"
                onClick={handleCursorClick} />
            <label htmlFor="cursor_cost">Next cursor cost: </label>
            <ToolCounter value={0} />
        </div>
        <div >
            <label htmlFor="Grandmas">Grandmas: </label>
            <ToolCounter value={gameState.grandmas} />
            <ToolButton img={grandma} alt="Buy grandma"
                onClick={handleGrandmaClick} />
            <label htmlFor="grandma_cost">Next grandma cost:</label>
            <ToolCounter value={0} />
        </div>
        <div >
            <label htmlFor="farms">Farms: </label>
            <ToolCounter value={gameState.farms} />
            <ToolButton img={farm} alt="Buy farm"
                onClick={handleFarmClick} />
            <label htmlFor="farm_cost">Next farm cost: </label>
            <ToolCounter value={0} />
        </div>
    </>
}