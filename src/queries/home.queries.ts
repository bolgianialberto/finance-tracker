import { supabase } from "@/src/lib/supabase";
import { getMonthRange } from "../lib/date-utils";

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utente non loggato");
  return user.id;
}

export async function fetchTotalBalance(): Promise<number> {
  console.log("[home.queries] fetchTotalBalance — start");
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("accounts")
    .select("balance")
    .eq("user_id", userId)
    .eq("is_archived", false);

  if (error) {
    console.error("[home.queries] fetchTotalBalance — error", error);
    throw error;
  }

  const total = data.reduce((sum, acc) => sum + (acc.balance ?? 0), 0);
  console.log("[home.queries] fetchTotalBalance — result:", total);
  return total;
}

export async function fetchMonthlyStats(): Promise<{
  income: number;
  expenses: number;
  netSavings: number;
}> {
  console.log("[home.queries] fetchMonthlyStats — start");
  const userId = await getUserId();

  const { firstDay, lastDay } = getMonthRange();

  console.log(
    "[home.queries] fetchMonthlyStats — range:",
    firstDay,
    "→",
    lastDay,
  );

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId)
    .is("transfer_id", null)
    .gte("date", firstDay)
    .lte("date", lastDay);

  if (error) {
    console.error("[home.queries] fetchMonthlyStats — error", error);
    throw error;
  }

  const income = data
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = data
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  console.log(
    "[home.queries] fetchMonthlyStats — income:",
    income,
    "expenses:",
    expenses,
  );

  return {
    income,
    expenses,
    netSavings: income - expenses,
  };
}
