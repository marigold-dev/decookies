export const grandma = (onBehalfOf: string) => {
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
                                    ["Left", ["Union", ["Right", ["Unit"]]]]]]]]]]]]]
}