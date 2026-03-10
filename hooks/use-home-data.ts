import { supabase } from "@/src/lib/supabase";
import {
    fetchMonthlyStats,
    fetchTotalBalance,
} from "@/src/queries/home.queries";
import { useEffect, useState } from "react";

interface HomeData {
  totalBalance: number;
  income: number;
  expenses: number;
  netSavings: number;
}

interface UseHomeDataReturn {
  data: HomeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHomeData(): UseHomeDataReturn {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("USER:", user?.id); // <- aggiungi questo

      const [totalBalance, { income, expenses, netSavings }] =
        await Promise.all([fetchTotalBalance(), fetchMonthlyStats()]);

      console.log("DATA:", { totalBalance, income, expenses, netSavings }); // <- e questo

      setData({ totalBalance, income, expenses, netSavings });
    } catch (e: any) {
      console.log("ERRORE:", e.message); // <- e questo
      setError(e.message ?? "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, refetch: load };
}
