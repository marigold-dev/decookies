export const transfer = (amount: string, onBehalfOf: string, to: string) => {
    return ["Union",
        ["Right",
            ["Union",
                ["Right",
                    ["Pair",
                        [["Pair",
                            [["Int", amount],
                            ["String", onBehalfOf]]],
                        ["String", to]]]]]]]
}