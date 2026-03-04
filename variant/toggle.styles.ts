import { Colors } from "@/constants/theme";

export type ToggleVariant = "selected" | "unselected";

export const FINANCE_TOGGLE_STYLES: Record<
  ToggleVariant,
  {
    background: keyof Colors;
    text: keyof Colors;
  }
> = {
  selected: {
    background: "toggleSelectedBg",
    text: "toggleSelectedText",
  },
  unselected: {
    background: "toggleUnselectedBg",
    text: "toggleUnselectedText",
  },
};

export const TIME_TOGGLE_STYLES: Record<
  ToggleVariant,
  {
    text: keyof Colors;
  }
> = {
  selected: {
    text: "toggleTimeSelectedText",
  },
  unselected: {
    text: "toggleTimeUnselectedText",
  },
};
