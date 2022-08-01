import * as React from 'react'

export type state = {
    number_of_cookie: number,
    number_of_cursor: number,
    number_of_grandma: number,
    number_of_farm: number,
    number_of_free_cursor: number,
    number_of_free_grandma: number,
    number_of_free_farm: number,
    cursor_cost: number,
    grandma_cost: number,
    farm_cost: number,
    cursor_cps: number,
    grandma_cps: number,
    farm_cps: number
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
type init_state_request = {
    type: "init_state_request",
    dispatch: React.Dispatch<action>
}
export type init_state_ok = {
    type: "init_state_ok",
    state: state
}
export type init_state_ko = {
    type: "init_state_ko",
    msg: string
}

export type cursorPassiveMint = {
    type: "cursor_passive_mint",
    active: boolean,
    state: state,
    dispatch: React.Dispatch<action>
}

export type action = addCookies | addCursors | addGrandmas | addFarms | init_state_request | init_state_ok | init_state_ko | cursorPassiveMint

// Action constructors
const add = (type: "add_cookie" | "add_cursor" | "add_grandma" | "add_farm") => (state: state, dispatch: React.Dispatch<action>): action => ({
    type,
    state,
    dispatch
});

export const request_init = (dispatch: React.Dispatch<action>) => ({
    type: "init_state_request",
    dispatch
})

export const activateCursorPassiveMint = (state: state, dispatch: React.Dispatch<action>) => ({
    type: "cursor_passive_mint",
    state,
    dispatch,
    active: true
})

export const addCookies = add("add_cookie");
export const addCursors = add("add_cursor");
export const addGrandmas = add("add_grandma");
export const addFarms = add("add_farm");