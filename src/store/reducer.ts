import { action } from './actions';

type state = {
    cookies: number,
    cursors: number,
    grandmas: number,
    farms: number,
};

export const initialState: state = {
    cookies: 0,
    cursors: 0,
    grandmas: 0,
    farms: 0,
}

export const reducer = (s: state, a: action): state => {
    switch (a.type) {
        case "add_grandma": return { ...s, grandmas: s.grandmas + a.quantity }
        case "add_cookie": return { ...s, cookies: s.cookies + a.quantity }
        case "add_farm": return { ...s, farms: s.farms + a.quantity }
        case "add_cursor": return { ...s, cursors: s.cursors + a.quantity }
    }
}