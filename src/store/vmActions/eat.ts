export const eat = (amount: string) => {
    return ["Pair",
        [
            ["Pair",
                [
                    ["Int", amount],
                    ["Option",
                        ["None", {}]]
                ]
            ],
            ["Pair",
                [
                    ["Union",
                        ["Left",
                            ["Union",
                                ["Left", ["Unit"]]
                            ]
                        ]
                    ],
                    ["Option", ["None", {}]]
                ]
            ]
        ]
    ]
}