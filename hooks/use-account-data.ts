import { Account } from "@/models/account";
import { useRefreshOn } from "@/src/lib/refresh-events";
import { fetchAccounts } from "@/src/queries/settings.queries";
import { useCallback, useEffect, useState } from "react";

export function useAccountsData() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRefreshOn(["accounts"], load);

  return { accounts, loadingAccounts, error, refetch: load };
}
