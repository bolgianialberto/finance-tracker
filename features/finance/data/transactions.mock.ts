import { Transaction } from "../models/transaction";

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    categoryId: "rent",
    amount: 900,
    note: "January rent",
    accountName: "Bank",
    type: "expenses",
    date: "12/07/26",
  },
  {
    id: "t2",
    categoryId: "food",
    amount: 120,
    note: "Groceries",
    accountName: "Card",
    type: "expenses",
    date: "12/07/26",
  },
  {
    id: "t3",
    categoryId: "food",
    amount: 80,
    note: "Restaurant",
    accountName: "Card",
    type: "expenses",
    date: "12/07/26",
  },
  {
    id: "t4",
    categoryId: "salary",
    amount: 2000,
    note: "Salary",
    accountName: "Bank",
    type: "income",
    date: "12/07/26",
  },
  {
    id: "t4",
    categoryId: "freelance",
    amount: 100,
    note: "Freelance",
    accountName: "Bank",
    type: "income",
    date: "12/07/26",
  },
];
