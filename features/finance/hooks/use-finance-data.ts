import { useEffect, useState } from "react";
import { getFinanceMock } from "../data/finance.mock";
import type { CategoryAmount } from "../models/category-amount";
import type { FinanceType } from "../models/finance-type";

export function useFinanceData(type: FinanceType) {
  const [data, setData] = useState<CategoryAmount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // 🔁 oggi mock
    const result = getFinanceMock(type);
    setData(result);
    setLoading(false);

    // 🚀 domani:
    // fetch(`/api/finance?type=${type}`)
  }, [type]);

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return {
    data,
    total,
    loading,
  };
}
