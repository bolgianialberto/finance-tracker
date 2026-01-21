import type { ColorToken } from "@/constants/colors";

export type CardVariant = "default" | "primary" | "success" | "danger";

export const CARD_STYLES: Record<
  CardVariant,
  {
    background: ColorToken;
    text: ColorToken;
    iconBg: ColorToken;
    icon: ColorToken;
  }
> = {
  default: {
    background: "baseCardBackground",
    text: "text",
    iconBg: "primarySoft",
    icon: "primary",
  },
  primary: {
    background: "primary",
    text: "lightText",
    iconBg: "primary",
    icon: "background",
  },
  success: {
    background: "baseCardBackground",
    text: "defaultText",
    iconBg: "successSoft",
    icon: "success",
  },
  danger: {
    background: "baseCardBackground",
    text: "defaultText",
    iconBg: "dangerSoft",
    icon: "danger",
  },
};
