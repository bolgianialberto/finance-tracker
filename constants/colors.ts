const tintColorLight = "#0a7ea4";
const tintColorDark = "#5548F9";

export type ColorToken = keyof typeof Colors.light;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorDark,
    icon: "#687076",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    baseCardBackground: "#fff",

    primary: "#5548F9",
    primarySoft: "#c1bee2ff",
    success: "#19e64cff",
    successSoft: "#b7ecb0ff",
    danger: "#ff0000ff",
    dangerSoft: "#f0b4b4ff",

    defaultText: "#11181C",
    lightText: "#fff",
  },
  dark: {
    text: "#ECEDEE",
    background: "#fff",
    tint: tintColorLight,
    icon: "#9BA1A6",
    tabIconDefault: "#5548F9",
    tabIconSelected: tintColorLight,
    baseCardBackground: "#ECEDEE",
    primary: "#5548F9",
    primarySoft: "#5548F9",
    success: "#1eff00ff",
    successSoft: "#b7ecb0ff",
    danger: "#ff0000ff",
    dangerSoft: "#f0b4b4ff",
    defaultText: "#11181C",
    lightText: "#fff",
  },
};
