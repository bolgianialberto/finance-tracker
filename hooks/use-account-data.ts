import { Account } from "@/models/account";
import { fetchAccounts } from "@/src/queries/settings.queries";
import { useEffect, useState } from "react";

export function useAccountsData() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoadingAccounts(true);
    setError(null);
    try {
      const data = await fetchAccounts();
      setAccounts(data);
    } catch (e: any) {
      setError(e.message ?? "Errore sconosciuto");
    } finally {
      setLoadingAccounts(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { accounts, loadingAccounts, error, refetch: load };
}
