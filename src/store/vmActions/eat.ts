export const eat = (amount: string, onBehalfOf: string) => {
    return ["Union",
        ["Left",
            ["Union",
                ["Right",
                    ["Pair",
                        [["Int", amount],
                        ["String", onBehalfOf]]]]]]]
}