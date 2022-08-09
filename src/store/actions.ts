import * as React from 'react'

export type state = {
    cookies: number,
    cursors: number,
    grandmas: number,
    farms: number,
    freeCursor: number,
    freeGrandma: number,
    freeFarm: number,
    cursorCost: number,
    grandmaCost: number,
    farmCost: number,
    cursorCps: number,
    grandmaCps: number,
    farmCps: number
};

type addCookies = {
    type: "ADD_COOKIE",
    dispatch: React.Dispatch<action>
}
type successfullyMinted = {
    type: "SUCCESSFULLY_MINTED",
    state: state
}
type addCursors = {
    type: "ADD_CURSOR",
    dispatch: React.Dispatch<action>
}
type addGrandmas = {
    type: "ADD_GRANDMA",
    dispatch: React.Dispatch<action>
}
type addFarms = {
    type: "ADD_FARM",
    dispatch: React.Dispatch<action>
}
type initStateRequest = {
    type: "INIT_STATE_REQUEST",
    dispatch: React.Dispatch<action>
}
export type initStateOk = {
    type: "INIT_STATE_OK",
    dispatch: React.Dispatch<action>
}
export type initStateKo = {
    type: "INIT_STATE_KO",
    msg: string
}
export type cursorPassiveMint = {
    type: "CURSOR_PASSIVE_MINT",
    dispatch: React.Dispatch<action>
}
export type passiveMint = {
    type: "PASSIVE_MINT",
    dispatch: React.Dispatch<action>
}


export type action = addCookies | addCursors | addGrandmas | addFarms | initStateRequest | initStateOk | initStateKo | passiveMint | cursorPassiveMint | successfullyMinted

// Action constructors
const add = (type: "ADD_COOKIE" | "ADD_CURSOR" | "ADD_GRANDMA" | "ADD_FARM") => (state: state, dispatch: React.Dispatch<action>): action => ({
    type,
    dispatch
});

export const requestInit = (dispatch: React.Dispatch<action>): action => ({
    type: "INIT_STATE_REQUEST",
    dispatch
})
export const activatePassiveMint = (state: state, dispatch: React.Dispatch<action>): action => ({
    type: "PASSIVE_MINT",
    dispatch
})
export const activateCursorPassiveMint = (state: state, dispatch: React.Dispatch<action>): action => ({
    type: "CURSOR_PASSIVE_MINT",
    dispatch
})

export const addCookie = add("ADD_COOKIE");
export const addCursor = add("ADD_CURSOR");
export const addGrandma = add("ADD_GRANDMA");
export const addFarm = add("ADD_FARM");