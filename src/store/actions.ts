import * as React from 'react'

export type state = {
    numberOfCookie: number,
    numberOfCursor: number,
    numberOfGrandma: number,
    numberOfFarm: number,
    numberOfFreeCursor: number,
    numberOfFreeGrandma: number,
    numberOfFreeFarm: number,
    cursorCost: number,
    grandmaCost: number,
    farmCost: number,
    cursorCps: number,
    grandmaCps: number,
    farmCps: number
};

type addCookies = {
    type: "add_cookie",
    state: state,
    dispatch: React.Dispatch<action>
}
type successfullyMinted = {
    type: "successfully_minted",
    state: state,
}
type addCursors = {
    type: "add_cursor",
    state: state,
    dispatch: React.Dispatch<action>
}
type addGrandmas = {
    type: "add_grandma",
    state: state,
    dispatch: React.Dispatch<action>
}
type addFarms = {
    type: "add_farm",
    state: state,
    dispatch: React.Dispatch<action>
}
type initStateRequest = {
    type: "init_state_request",
    dispatch: React.Dispatch<action>
}
export type initStateOk = {
    type: "init_state_ok",
    state: state
    dispatch: React.Dispatch<action>
}
export type initStateKo = {
    type: "init_state_ko",
    msg: string
}
export type cursorPassiveMint = {
    type: "cursor_passive_mint",
    state: state
    dispatch: React.Dispatch<action>
}
export type passiveMint = {
    type: "passive_mint",
    state: state
    dispatch: React.Dispatch<action>
}


export type action = addCookies | addCursors | addGrandmas | addFarms | initStateRequest | initStateOk | initStateKo | passiveMint | cursorPassiveMint | successfullyMinted

// Action constructors
const add = (type: "add_cookie" | "add_cursor" | "add_grandma" | "add_farm") => (state: state, dispatch: React.Dispatch<action>): action => ({
    type,
    state,
    dispatch
});

export const requestInit = (dispatch: React.Dispatch<action>): action => ({
    type: "init_state_request",
    dispatch
})
export const activatePassiveMint = (state: state, dispatch: React.Dispatch<action>): action => ({
    type: "passive_mint",
    state,
    dispatch
})
export const activateCursorPassiveMint = (state: state, dispatch: React.Dispatch<action>): action => ({
    type: "cursor_passive_mint",
    state,
    dispatch
})

export const addCookie = add("add_cookie");
export const addCursor = add("add_cursor");
export const addGrandma = add("add_grandma");
export const addFarm = add("add_farm");