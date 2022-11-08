export const transfer = (amount: string, to: string) => {
    return ["Pair",
        [
            ["Pair",
                [
                    ["Int", amount],
                    ["Option", ["None", {}]]
                ]
            ],
            ["Pair",
                [
                    ["Union",
                        ["Right", ["Unit"]]
                    ],
                    ["Option",
                        ["Some",
                            ["String", to]]
                    ]
                ]
            ]
        ]
    ]
}