import { Colors } from "../theme";

export type CardVariant = "default" | "primary" | "success" | "danger";

export const CARD_STYLES: Record<
  CardVariant,
  {
    background: keyof Colors;
    text: keyof Colors;
    iconBg: keyof Colors;
    icon: keyof Colors;
  }
> = {
  default: {
    background: "backgroundCard",
    text: "text",
    iconBg: "primarySoft",
    icon: "primary",
  },
  primary: {
    background: "primary",
    text: "textLight",
    iconBg: "primary",
    icon: "background",
  },
  success: {
    background: "backgroundCard",
    text: "text",
    iconBg: "successSoft",
    icon: "success",
  },
  danger: {
    background: "backgroundCard",
    text: "text",
    iconBg: "dangerSoft",
    icon: "danger",
  },
};
