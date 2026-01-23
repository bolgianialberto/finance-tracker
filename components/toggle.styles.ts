import type { ColorToken } from "@/constants/colors";

export type ToggleVariant = "selected" | "unselected";

export const TOGGLE_STYLES: Record<
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
