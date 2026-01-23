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

    toggleBackground: "#bfc2c4ff",
    selectedToggleBackground: "#E5E7EB",
    unselectedToggleBackground: "#bfc2c4ff",
    selectedToggleText: "#11181C",
    unselectedToggleText: "#11181C",
  },
  dark: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorDark,
    icon: "#687076",
    tabIconDefault: "#bfc2c4ff",
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

    toggleBackground: "#bfc2c4ff",
    selectedToggleBackground: "#E5E7EB",
    unselectedToggleBackground: "#bfc2c4ff",
    selectedToggleText: "#11181C",
    unselectedToggleText: "#11181C",
  },
};
