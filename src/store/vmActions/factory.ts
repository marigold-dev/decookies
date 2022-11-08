export const factory =
    ["Pair",
        [
            ["Pair",
                [
                    ["Int", "1"],
                    ["Option",
                        ["Some",
                            ["Union",
                                ["Left",
                                    ["Union",
                                        ["Right",
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