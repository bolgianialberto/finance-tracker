import { useEffect, useState } from "react";
import { getFinanceMock } from "../data/finance.mock";
import { mockTransactions } from "../data/transactions.mock";
import { CategoryStats } from "../models/category-stats";
import type { FinanceType } from "../models/finance-type";
import { Transaction } from "../models/transaction";

export function useFinanceData(type: FinanceType) {
  const [data, setData] = useState<CategoryStats[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // 🔁 oggi mock
    const categories = getFinanceMock(type);
    setData(categories);

    const tsx = mockTransactions.filter((tx) =>
      categories.some((c) => c.category.id === tx.categoryId),
    );
    setTransactions(tsx);

    setLoading(false);

    // 🚀 domani:
    // fetch(`/api/finance?type=${type}`)
  }, [type]);

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return {
    data,
    transactions,
    total,
    loading,
  };
}
