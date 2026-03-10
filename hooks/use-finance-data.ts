import { CategoryAmount } from "@/models/category-amount";
import { CategoryStats } from "@/models/category-stats";
import { FinanceType } from "@/models/finance-type";
import { Transaction } from "@/models/transaction";
import { fetchTransactionsData } from "@/src/queries/transactions.queries";
import { useEffect, useState } from "react";

interface UseFinanceDataReturn {
  data: CategoryStats[]; // per CategoryLegend
  amounts: CategoryAmount[]; // per FinanceDonutChart
  transactions: Transaction[]; // per la lista dentro ogni categoria
  total: number; // per il centro del donut
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFinanceData(type: FinanceType): UseFinanceDataReturn {
  const [data, setData] = useState<CategoryStats[]>([]);
  const [amounts, setAmounts] = useState<CategoryAmount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    // "general" non è supportato in questa schermata
    if (type === "general") return;

    setLoading(true);
    setError(null);
    try {
      const result = await fetchTransactionsData(type);
      setData(result.categoryStats);
      setAmounts(result.categoryAmounts);
      setTransactions(result.transactions);
      setTotal(result.total);
    } catch (e: any) {
      setError(e.message ?? "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }

  // Si ricarica ogni volta che cambia il tipo (income ↔ expense)
  useEffect(() => {
    load();
  }, [type]);

  return { data, amounts, transactions, total, loading, error, refetch: load };
}
