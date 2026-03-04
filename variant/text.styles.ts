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
  },
  caption: {
    fontSize: theme.typography.size.sm, // 12
    lineHeight: 24,
    fontFamily: theme.typography.family.sans,
  },
  captionBold: {
    fontSize: theme.typography.size.sm, // 12
    lineHeight: 24,
    fontWeight: theme.typography.weight.semibold,
    fontFamily: theme.typography.family.sans,
  },
  defaultSemiBold: {
    fontSize: theme.typography.size.base, // 16
    lineHeight: 24,
    fontWeight: theme.typography.weight.semibold,
    fontFamily: theme.typography.family.sans,
  },
  title: {
    fontSize: theme.typography.size.h1, // 32
    lineHeight: 32,
    fontWeight: theme.typography.weight.bold,
    fontFamily: theme.typography.family.sans,
  },
  subtitle: {
    fontSize: theme.typography.size.xl, // 20
    fontWeight: theme.typography.weight.bold,
    fontFamily: theme.typography.family.sans,
  },
  link: {
    fontSize: theme.typography.size.base, // 16
    lineHeight: 30,
    fontFamily: theme.typography.family.sans,
  },
};
