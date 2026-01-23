import type { CategoryAmount } from "../models/category-amount";

const incomeCategories: CategoryAmount[] = [
  {
    category: {
      id: "salary",
      name: "Salary",
      icon: "house.fill",
      color: "#5548F9",
    },
    amount: 2400,
  },
  {
    category: {
      id: "freelance",
      name: "Freelance",
      icon: "house.fill",
      color: "#19e64c",
    },
    amount: 600,
  },
];

const expenseCategories: CategoryAmount[] = [
  {
    category: {
      id: "rent",
      name: "Rent",
      icon: "house.fill",
      color: "#ff0000",
    },
    amount: 900,
  },
  {
    category: {
      id: "food",
      name: "Food",
      icon: "house.fill",
      color: "#ff9800",
    },
    amount: 400,
  },
];

export function getFinanceMock(type: "income" | "expenses") {
  return type === "income" ? incomeCategories : expenseCategories;
}
