export const factory = (layerOneAddress: string) => {
    return ["Pair", [["Pair", [["Pair", [["Int", "1"], ["String", layerOneAddress]]], ["Pair", [["Option", ["Some", ["Union", ["Left", ["Union", ["Right", ["Union", ["Right", ["Unit"]]]]]]]]], ["Union", ["Left", ["Union", ["Right", ["Unit"]]]]]]]]], ["Option", ["None", {}]]]]
}