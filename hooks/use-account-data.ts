import { useEffect, useState } from "react";
import { mockAccounts } from "../data/settings.mock";
import { Account } from "../models/account";

export function useSettingsData() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    setLoadingAccounts(true);

    // 🔁 oggi mock
    setAccounts(mockAccounts);

    setLoadingAccounts(false);

    // 🚀 domani:
    // fetch("/api/accounts")
  }, []);

  return {
    accounts,
    loadingAccounts,
  };
}
