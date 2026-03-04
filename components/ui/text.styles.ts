import { theme } from "@/constants/theme";
import { TextStyle } from "react-native";

export type TextVariant =
  | "default"
  | "caption"
  | "captionBold"
  | "defaultSemiBold"
  | "title"
  | "subtitle"
  | "link";

export const TEXT_STYLES: Record<TextVariant, TextStyle> = {
  default: {
    fontSize: theme.typography.size.base, // 16
    lineHeight: 24,
    fontFamily: theme.typography.family.sans,
    color: theme.colors.text,
  },
  caption: {
    fontSize: theme.typography.size.sm, // 12
    lineHeight: 24,
    fontFamily: theme.typography.family.sans,
    color: theme.colors.textMuted,
  },
  captionBold: {
    fontSize: theme.typography.size.sm, // 12
    lineHeight: 24,
    fontWeight: theme.typography.weight.semibold,
    fontFamily: theme.typography.family.sans,
    color: theme.colors.textMuted,
  },
  defaultSemiBold: {
    fontSize: theme.typography.size.base, // 16
    lineHeight: 24,
    fontWeight: theme.typography.weight.semibold,
    fontFamily: theme.typography.family.sans,
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.typography.size.h1, // 32
    lineHeight: 32,
    fontWeight: theme.typography.weight.bold,
    fontFamily: theme.typography.family.sans,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.size.xl, // 20
    fontWeight: theme.typography.weight.bold,
    fontFamily: theme.typography.family.sans,
    color: theme.colors.text,
  },
  link: {
    fontSize: theme.typography.size.base, // 16
    lineHeight: 30,
    fontFamily: theme.typography.family.sans,
    color: theme.colors.primary,
  },
};
