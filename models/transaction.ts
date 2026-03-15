import { FinanceType } from "./finance-type";

export type Transaction = {
  id: string;
  categoryId: string;
  accountId: string; // aggiunto per permettere la modifica
  amount: number;
  note?: string;
  accountName: string;
  type: FinanceType;
  date: string;
};
