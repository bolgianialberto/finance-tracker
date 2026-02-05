import { CategoryStats } from "../models/category-stats";

const incomeCategories: CategoryStats[] = [
  {
    category: {
      id: "salary",
      name: "Salary",
      icon: "house.fill",
      color: "#5548F9",
    },
    amount: 2400,
    transactionCount: 2,
  },
  {
    category: {
      id: "freelance",
      name: "Freelance",
      icon: "house.fill",
      color: "#19e64c",
    },
    amount: 600,
    transactionCount: 1,
  },
];

const expenseCategories: CategoryStats[] = [
  {
    category: {
      id: "rent",
      name: "Rent",
      icon: "house.fill",
      color: "#ff0000",
    },
    amount: 900,
    transactionCount: 1,
  },
  {
    category: {
      id: "food",
      name: "Food",
      icon: "house.fill",
      color: "#ff9800",
    },
    amount: 400,
    transactionCount: 2,
  },
];

export function getFinanceMock(type: "income" | "expenses" | "general") {
  return type === "income" ? incomeCategories : expenseCategories;
}
