type addCookies = {
    type: "add_cookie"
    quantity: number
}
type addCursors = {
    type: "add_cursor"
    quantity: number
}
type addGrandmas = {
    type: "add_grandma"
    quantity: number
}
type addFarms = {
    type: "add_farm"
    quantity: number
}

export type action = addCookies | addCursors | addGrandmas | addFarms

// Action constructors
const add = (type: "add_cookie" | "add_cursor" | "add_grandma" | "add_farm") => (quantity: number): action => ({
    type,
    quantity
});

export const addCookies = add("add_cookie");
export const addCursors = add("add_cursor");
export const addGrandmas = add("add_grandma");
export const addFarms = add("add_farm");