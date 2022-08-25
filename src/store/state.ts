import { cookieBaker, initialCookieBaker } from "./cookieBaker"

export type applicationState = {
    cookieBaker: cookieBaker,
    address: string | null,
    nodeUri: string | null,
    privateKey: string | null
}

export const initialState: applicationState = {
    cookieBaker: initialCookieBaker,
    address: null,
    nodeUri: null,
    privateKey: null
}