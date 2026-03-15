import { IconSymbolName } from "@/components/ui/icon-symbol";

export type CategoryType = "income" | "expense" | "general";

export type Category = {
  id: string;
  name: string;
  icon: IconSymbolName; // icona risolta per la UI
  iconKey: string; // chiave generica salvata su DB (es. "food", "fitness")
  color: string;
  type: CategoryType;
  isGlobal: boolean; // true = categoria comune a tutti, non modificabile
};
