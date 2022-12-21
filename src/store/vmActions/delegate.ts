export const delegate = (onBehalfOf: string) => {
    return ["Union",
        ["Left",
            ["Union",
                ["Left",
                    ["String", onBehalfOf]]]]]
}