import type { ColorToken } from "@/constants/colors";

export type ToggleVariant = "selected" | "unselected";

export const FINANCE_TOGGLE_STYLES: Record<
  ToggleVariant,
  {
    background: ColorToken;
    text: ColorToken;
  }
> = {
  selected: {
    background: "selectedToggleBackground",
    text: "selectedToggleText",
  },
  unselected: {
    background: "unselectedToggleBackground",
    text: "unselectedToggleText",
  },
};

export const TIME_TOGGLE_STYLES: Record<
  ToggleVariant,
  {
    text: ColorToken;
  }
> = {
  selected: {
    text: "selectedToggleText",
  },
  unselected: {
    text: "unselectedToggleText",
  },
};
