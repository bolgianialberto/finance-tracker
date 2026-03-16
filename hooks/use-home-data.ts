import { useRefreshOn } from "@/src/lib/refresh-events";
import {
  fetchMonthlyStats,
  fetchTotalBalance,
} from "@/src/queries/home.queries";
import { useCallback, useEffect, useState } from "react";

type HomeData = {
  totalBalance: number;
  income: number;
  expenses: number;
  netSavings: number;
};

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [totalBalance, { income, expenses }] = await Promise.all([
        fetchTotalBalance(),
        fetchMonthlyStats(),
      ]);
      setData({
        totalBalance,
        income,
        expenses,
        netSavings: income - expenses,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Si ricarica quando cambiano transazioni o account
  useRefreshOn(["transactions", "accounts"], load);

  return { data, loading, refetch: load };
}
