export type Transaction = {
  id: string;
  categoryId: string;
  amount: number;
  note?: string;
  accountName: string;
  type: string;
};
