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

    toggleBackground: "#e2e1e1ff",
    selectedToggleBackground: "#f9fafcff",
    unselectedToggleBackground: "#e2e1e1ff",
    selectedToggleText: "#11181C",
    unselectedToggleText: "#11181C",

    selectedTimeToggleText: "#11181C",
    unselectedTimeToggleText: "#ccccccff",

    income: "#19e64cff",
    expense: "#d8e619ff",
    gain: "#5548F9",
    loss: "#ff0000ff",

    divider: "#11181C",

    barChartTextLabel: "#11181C",
  },
  dark: {
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

    toggleBackground: "#ccccccff",
    selectedToggleBackground: "#E5E7EB",
    unselectedToggleBackground: "#ccccccff",
    selectedToggleText: "#11181C",
    unselectedToggleText: "#11181C",

    selectedTimeToggleText: "#11181C",
    unselectedTimeToggleText: "#ccccccff",

    income: "#19e64cff",
    expense: "#d8e619ff",
    gain: "#5548F9",
    loss: "#ff0000ff",

    divider: "#11181C",

    barChartTextLabel: "#11181C",
  },
};
