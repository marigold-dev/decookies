import { createContext, useContext, useReducer } from 'react';
import { initialState, reducer } from './reducer';

const GameContext = createContext(null);

const GameDispatchContext = createContext(null);

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        reducer,
        initialState
    );
    return (
        <GameContext.Provider value={state} >
            <GameDispatchContext.Provider value={dispatch}>
                {children}
            </GameDispatchContext.Provider>
        </GameContext.Provider>
    );
}

export const useGame = () => useContext(GameContext);

export const useGameDispatch = () => useContext(GameDispatchContext);
