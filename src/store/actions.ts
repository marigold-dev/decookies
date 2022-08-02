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
}
export type initStateKo = {
    type: "init_state_ko",
    msg: string
}

export type action = addCookies | addCursors | addGrandmas | addFarms | initStateRequest | initStateOk | initStateKo

// Action constructors
const add = (type: "add_cookie" | "add_cursor" | "add_grandma" | "add_farm") => (state: state, dispatch: React.Dispatch<action>): action => ({
    type,
    state,
    dispatch
});

export const requestInit = (dispatch: React.Dispatch<action>) => ({
    type: "init_state_request",
    dispatch
})

export const addCookies = add("add_cookie");
export const addCursors = add("add_cursor");
export const addGrandmas = add("add_grandma");
export const addFarms = add("add_farm");