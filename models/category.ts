import { IconSymbolName } from "@/components/ui/icon-symbol";

export type CategoryType = "income" | "expense" | "general";

export type Category = {
  id: string;
  name: string;
  icon: IconSymbolName;
  color: string;
  type: CategoryType;
};
