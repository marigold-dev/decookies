export const temple = (onBehalfOf: string) => {
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
                                    ["Right", ["Union", ["Right", ["Unit"]]]]]]]]]]]]]
}