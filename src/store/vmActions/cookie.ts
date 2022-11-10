export const cookie = (amount: string) => {
    return ["Pair",
        [
            ["Pair",
                [
                    ["Int", amount],
                    ["Option",
                        ["Some",
                            ["Union",
                                ["Left",
                                    ["Union",
                                        ["Left",
                                            ["Union",
                                                ["Right", ["Unit"]]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            ["Pair",
                [
                    ["Union",
                        ["Left",
                            ["Union",
                                ["Right", ["Unit"]]
                            ]
                        ]
                    ],
                    ["Option", ["None", {}]]
                ]
            ]
        ]
    ]
}