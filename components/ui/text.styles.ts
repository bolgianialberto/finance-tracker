import { TextStyle } from "react-native";

export type TextVariant =
  | "default"
  | "caption"
  | "captionBold"
  | "title"
  | "defaultSemiBold"
  | "subtitle"
  | "link";

export const TEXT_STYLES: Record<TextVariant, TextStyle> = {
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    lineHeight: 24,
  },
  captionBold: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: "600",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
};
