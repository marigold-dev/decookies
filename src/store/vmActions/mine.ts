export const mine = (onBehalfOf: string) => {
    return ["Union",
        ["Right",
            ["Union",
                ["Left",
                    ["Pair",
                        [["Pair",
                            [["Int", "1"],
                            ["String", onBehalfOf]]],
                        ["Union",
                            ["Right",
                                ["Union",
                                    ["Right", ["Union", ["Left", ["Unit"]]]]]]]]]]]]]
}