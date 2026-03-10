import { supabase } from "@/src/lib/supabase";

// Prende l'ID dell'utente loggato
async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utente non loggato");
  return user.id;
}

// Somma i balance di tutti gli account dell'utente
export async function fetchTotalBalance(): Promise<number> {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("accounts")
    .select("balance")
    .eq("user_id", userId)
    .eq("is_archived", false);

  if (error) throw error;
  return data.reduce((sum, acc) => sum + (acc.balance ?? 0), 0);
}

// Income, Expenses e Net Savings del mese corrente
export async function fetchMonthlyStats(): Promise<{
  income: number;
  expenses: number;
  netSavings: number;
}> {
  const userId = await getUserId();

  // Primo e ultimo giorno del mese corrente
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId)
    .is("transfer_id", null) // escludi i trasferimenti interni
    .gte("date", firstDay)
    .lte("date", lastDay);

  if (error) throw error;

  const income = data
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = data
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    netSavings: income - expenses,
  };
}
