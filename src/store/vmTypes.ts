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
    transfer = "transfer"
}

export type vmOperation = {
    type: operationType
    operation: building | transfer
}

export type transfer = {
    to: string
    amount: string
}

export type leaderBoard = {
    address: string,
    eatenCookies: bigint
}

export const cookieBakerToLeaderBoard = ([address, baker]: [string, cookieBaker]): leaderBoard => {
    console.log("address: " + address);
    console.log("baker: " + baker);
    console.log("eaten: " + baker.eatenCookies);
    return { address, eatenCookies: baker.eatenCookies };
}
