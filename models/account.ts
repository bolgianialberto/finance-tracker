import { IconSymbolName } from "@/components/ui/icon-symbol";

export type Account = {
  id: string;
  name: string;
  balance: number;
  icon: IconSymbolName;
  color: string;
};
