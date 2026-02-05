import { FinanceType } from "./finance-type";

export type Transaction = {
  id: string;
  categoryId: string;
  amount: number;
  note?: string;
  accountName: string;
  type: FinanceType;
  date: string;
};
