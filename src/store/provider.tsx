import { createContext, useContext, useReducer } from 'react';
import { action } from './actions';
import { reducer } from './reducer';
import { applicationState, initialState } from './cookieBaker';


const GameContext: React.Context<any> = createContext(null);

const GameDispatchContext: React.Context<any> = createContext(null);

export const GameProvider = ({ children }: { children: React.ReactNode; }) => {
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

export const useGame = (): applicationState => useContext(GameContext);

export const useGameDispatch = (): React.Dispatch<action> => useContext(GameDispatchContext);
