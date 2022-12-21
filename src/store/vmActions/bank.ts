export const bank = (onBehalfOf: string) => {
    return ["Union",
        ["Right",
            ["Union",
                ["Left",
                    ["Pair",
                        [["Pair",
                            [["Int", "1"],
                            ["String", onBehalfOf]]],
                        ["Union",
                            ["Left",
                                ["Union",
                                    ["Left", ["Union", ["Left", ["Unit"]]]]]]]]]]]]]
}