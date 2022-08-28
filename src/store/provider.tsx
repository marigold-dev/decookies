import { createContext, useContext, useReducer } from 'react';
import { action } from './actions';
import { reducer, state, initialState } from './reducer';


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

export const useGame = (): state => useContext(GameContext);

export const useGameDispatch = (): React.Dispatch<action> => useContext(GameDispatchContext);
