export const factory = (onBehalfOf: string) => {
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
                                    ["Right", ["Union", ["Right", ["Unit"]]]]]]]]]]]]]
}