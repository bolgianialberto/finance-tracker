import { Platform } from "react-native";

// ─────────────────────────────────────────────
// PALETTE — colori grezzi, non usare direttamente nei componenti
// ─────────────────────────────────────────────
const palette = {
  purple: "#5548F9",
  purpleSoft: "#c1bee2ff",

  green: "#19e64cff",
  greenSoft: "#b7ecb0ff",

  red: "#ff0000ff",
  redSoft: "#f0b4b4ff",

  yellow: "#d8e619ff",

  black: "#11181C",
  white: "#ffffff",
  grey: "#687076",
  greyLight: "#9BA1A6",
  greyMid: "#ccccccff",
  greyBg: "#e2e1e1ff",
  greyBgAlt: "#E5E7EB",
  offWhite: "#f9fafcff",
} as const;

// ─────────────────────────────────────────────
// FONTS
// ─────────────────────────────────────────────
const fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
})!;

// ─────────────────────────────────────────────
// TYPOGRAPHY — dimensioni e pesi
// ─────────────────────────────────────────────
const typography = {
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    h2: 28,
    h1: 32,
  },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    black: "900" as const,
  },
  family: fonts,
} as const;

// ─────────────────────────────────────────────
// SPACING — usato per padding, margin, gap
// ─────────────────────────────────────────────
const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  m: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────
const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

// ─────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────
const shadows = {
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ─────────────────────────────────────────────
// COLORI SEMANTICI — questi si usano nei componenti
// ─────────────────────────────────────────────
const colors = {
  // brand
  primary: palette.purple,
  primarySoft: palette.purpleSoft,

  // stati
  success: palette.green,
  successSoft: palette.greenSoft,
  danger: palette.red,
  dangerSoft: palette.redSoft,
  warning: palette.yellow,

  // testo
  text: palette.black,
  textLight: palette.white,
  textMuted: palette.grey,
  textDisabled: palette.greyMid,

  // sfondi
  background: palette.white,
  backgroundCard: palette.white,
  backgroundMuted: palette.offWhite,
  transLegendBackground: palette.greyBgAlt,

  // icone e tab bar
  icon: palette.grey,
  tabIconDefault: palette.greyLight,
  tabIconSelected: palette.purple,

  // toggle
  toggleBg: palette.greyBg,
  toggleSelectedBg: palette.offWhite,
  toggleUnselectedBg: palette.greyBg,
  toggleSelectedText: palette.black,
  toggleUnselectedText: palette.black,
  toggleTimeSelectedText: palette.black,
  toggleTimeUnselectedText: palette.greyMid,

  // grafici / finanza
  chartIncome: palette.green,
  chartExpense: palette.yellow,
  chartGain: palette.purple,
  chartLoss: palette.red,

  // decorativi
  divider: palette.black,
  barChartLabel: palette.black,

  // cards
  baseCardBackground: palette.white,

  // bar
  income: palette.green,
  expense: palette.yellow,
  gain: palette.purple,
  loss: palette.red,

  // toggle
  toggleBackground: palette.greyBg,

  // divider
  settingDivider: palette.greyBgAlt,
  transDivider: palette.greyBgAlt,
} as const;

// ─────────────────────────────────────────────
// LOCALIZZAZIONE
// ─────────────────────────────────────────────
const locale = {
  language: "it-IT", // cambia qui per tutta l'app
  currency: "EUR", // cambia qui per tutta l'app
  timezone: "Europe/Rome",
} as const;

// ─────────────────────────────────────────────
// TEMA UNIFICATO
// ─────────────────────────────────────────────
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  locale,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radius = typeof radius;

// Esporta anche la palette per casi eccezionali (es. generare varianti dinamiche)
export { palette };
