import { CategoryAmount } from "@/models/category-amount";
import { CategoryStats } from "@/models/category-stats";
import { FinanceType } from "@/models/finance-type";
import { Transaction } from "@/models/transaction";
import { useRefreshOn } from "@/src/lib/refresh-events";
import { fetchTransactionsData } from "@/src/queries/transactions.queries";
import { useCallback, useEffect, useState } from "react";

type FinanceData = {
  data: CategoryStats[];
  amounts: CategoryAmount[];
  transactions: Transaction[];
  total: number;
  loading: boolean;
  refetch: () => void;
};

export function useFinanceData(
  type: Exclude<FinanceType, "general">,
): FinanceData {
  const [data, setData] = useState<CategoryStats[]>([]);
  const [amounts, setAmounts] = useState<CategoryAmount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchTransactionsData(type);
      setData(result.categoryStats);
      setAmounts(result.categoryAmounts);
      setTransactions(result.transactions);
      setTotal(result.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  useRefreshOn(["transactions"], load);

  return { data, amounts, transactions, total, loading, refetch: load };
}
