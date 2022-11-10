import { cookieBaker } from "./cookieBaker"
import { parseReviver } from "./utils"

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
    type: operationType,
    operation: building | null
    amount: string
}

export type transfer = {
    to: string
    amount: string
}
