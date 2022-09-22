import { cookieBaker } from "./cookieBaker"

export enum building {
    cookie = "cookie",
    cursor = "cursor",
    grandma = "grandma",
    farm = "farm",
    mine = "mine",
    factory = "factory",
    bank = "bank",
    temple = "temple",
    wizard = "wizard",
    shipment = "shipment",
    alchemy = "alchemy",
    portal = "portal",
    timeMachine = "timemachine",
    antimatter = "antimatter",
    prism = "prism",
    chanceMaker = "chancemaker",
    fractal = "fractal",
    javaScript = "javaScript",
    idleverse = "idleverse",
    cordex = "cordex",
}

export enum operationType {
    mint = "mint",
    transfer = "transfer",
    eat = "eat"
}

export type vmOperation = {
    type: operationType
    operation: building | transfer | eat
}

export type transfer = {
    to: string
    amount: string
}

export type leaderBoard = {
    address: string,
    eatenCookies: bigint
}

export type eat = {
    amount: string
}

export const cookieBakerToLeaderBoard = (element: any): leaderBoard => {
    const cookieBaker: cookieBaker = element[1]
    return { address: element[0], eatenCookies: cookieBaker.eatenCookies };
}
