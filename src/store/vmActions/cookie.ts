export const cookie = (amount: string, layerOneAddress: string) => {
    return ["Union",
        ["Right",
            ["Union",
                ["Left",
                    ["Pair",
                        [["Pair",
                            [["Int", amount],
                                ["String", layerOneAddress]]],
                        ["Union",
                            ["Left",
                                ["Union",
                                    ["Left", ["Union", ["Right", ["Unit"]]]]]]]]]]]]]
}