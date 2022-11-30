export const transfer = (amount: string, to: string, layerOneAddress: string) => {
    return ["Pair", [["Pair", [["Pair", [["Int", amount], ["String", layerOneAddress]]], ["Pair", [["Option", ["None", {}]], ["Union", ["Right", ["Unit"]]]]]]], ["Option", ["Some", ["String", to]]]]]
}