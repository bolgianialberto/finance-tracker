import { resolveIcon } from "@/constants/icon-map";
import { CategoryAmount } from "@/models/category-amount";
import { CategoryStats } from "@/models/category-stats";
import { FinanceType } from "@/models/finance-type";
import { Transaction } from "@/models/transaction";
import { emitRefresh } from "@/src/lib/refresh-events";
import { supabase } from "@/src/lib/supabase";
import { getMonthRange } from "../lib/date-utils";

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utente non loggato");
  return user.id;
}

export async function fetchTransactionsData(
  type: Exclude<FinanceType, "general">,
): Promise<{
  categoryStats: CategoryStats[];
  categoryAmounts: CategoryAmount[];
  transactions: Transaction[];
  total: number;
}> {
  console.log("[transactions.queries] fetchTransactionsData — start", { type });
  const userId = await getUserId();
  const { firstDay, lastDay } = getMonthRange();
  console.log(
    "[transactions.queries] fetchTransactionsData — range:",
    firstDay,
    "→",
    lastDay,
  );

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id, amount, type, note, date, category_id, account_id,
      category:categories ( id, name, icon, color, type ),
      account:accounts ( id, name )
    `,
    )
    .eq("user_id", userId)
    .eq("type", type)
    .is("transfer_id", null)
    .gte("date", firstDay)
    .lte("date", lastDay)
    .order("date", { ascending: false });

  if (error) {
    console.error(
      "[transactions.queries] fetchTransactionsData — error",
      error,
    );
    throw error;
  }

  if (!data || data.length === 0) {
    console.log("[transactions.queries] fetchTransactionsData — no data found");
    return {
      categoryStats: [],
      categoryAmounts: [],
      transactions: [],
      total: 0,
    };
  }

  const transactions = mapToTransactions(data);
  const { categoryStats, categoryAmounts, total } = groupByCategory(data);
  console.log("[transactions.queries] fetchTransactionsData — result:", {
    transactions: transactions.length,
    categories: categoryStats.length,
    total,
  });
  return { categoryStats, categoryAmounts, transactions, total };
}

export async function fetchAllTransactions(
  type: FinanceType,
): Promise<Transaction[]> {
  console.log("[transactions.queries] fetchAllTransactions — start", { type });
  const userId = await getUserId();

  let query = supabase
    .from("transactions")
    .select(
      `
      id, amount, type, note, date, category_id, account_id,
      account:accounts ( id, name )
    `,
    )
    .eq("user_id", userId)
    .is("transfer_id", null)
    .order("date", { ascending: true });

  if (type !== "general") query = query.eq("type", type);

  const { data, error } = await query;
  if (error) {
    console.error("[transactions.queries] fetchAllTransactions — error", error);
    throw error;
  }

  const result = data ? mapToTransactions(data) : [];
  console.log(
    "[transactions.queries] fetchAllTransactions — result:",
    result.length,
    "transactions",
  );
  return result;
}

export async function insertTransaction(params: {
  amount: number;
  type: Exclude<FinanceType, "general">;
  categoryId: string;
  categoryName: string;
  accountId: string;
  date: string;
  note?: string;
}): Promise<void> {
  console.log("[transactions.queries] insertTransaction — start", params);
  const userId = await getUserId();
  const finalNote = params.note?.trim() || params.categoryName;

  const { error } = await supabase.from("transactions").insert({
    user_id: userId,
    account_id: params.accountId,
    category_id: params.categoryId,
    amount: params.amount,
    type: params.type,
    note: finalNote,
    date: params.date,
  });

  if (error) {
    console.error("[transactions.queries] insertTransaction — error", error);
    throw error;
  }

  console.log(
    "[transactions.queries] insertTransaction — success, emitting refresh",
  );
  emitRefresh("transactions", "accounts");
}

export async function updateTransaction(params: {
  id: string;
  amount: number;
  type: Exclude<FinanceType, "general">;
  categoryId: string;
  accountId: string;
  date: string;
  note?: string;
}): Promise<void> {
  console.log("[transactions.queries] updateTransaction — start", params);

  const { error } = await supabase
    .from("transactions")
    .update({
      amount: params.amount,
      type: params.type,
      category_id: params.categoryId,
      account_id: params.accountId,
      date: params.date,
      note: params.note?.trim() || undefined,
    })
    .eq("id", params.id);

  if (error) {
    console.error("[transactions.queries] updateTransaction — error", error);
    throw error;
  }

  console.log(
    "[transactions.queries] updateTransaction — success, emitting refresh",
  );
  emitRefresh("transactions", "accounts");
}

export async function deleteTransaction(id: string): Promise<void> {
  console.log("[transactions.queries] deleteTransaction — start", { id });

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error("[transactions.queries] deleteTransaction — error", error);
    throw error;
  }

  console.log(
    "[transactions.queries] deleteTransaction — success, emitting refresh",
  );
  emitRefresh("transactions", "accounts");
}

// --- Helpers ---

function mapToTransactions(data: any[]): Transaction[] {
  return data.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    accountId: row.account_id,
    amount: row.amount,
    note: row.note ?? undefined,
    accountName: row.account?.name ?? "—",
    type: row.type,
    date: row.date,
  }));
}

function groupByCategory(data: any[]): {
  categoryStats: CategoryStats[];
  categoryAmounts: CategoryAmount[];
  total: number;
} {
  const statsMap = new Map<string, CategoryStats>();

  for (const row of data) {
    const cat = row.category;
    if (!cat) continue;

    if (!statsMap.has(cat.id)) {
      statsMap.set(cat.id, {
        category: {
          id: cat.id,
          name: cat.name,
          icon: resolveIcon(cat.icon),
          iconKey: cat.icon,
          color: cat.color,
          type: cat.type,
          isGlobal: false,
        },
        amount: 0,
        transactionCount: 0,
      });
    }

    const entry = statsMap.get(cat.id)!;
    entry.amount += row.amount;
    entry.transactionCount += 1;
  }

  const categoryStats = Array.from(statsMap.values()).sort(
    (a, b) => b.amount - a.amount,
  );
  const categoryAmounts = categoryStats.map((s) => ({
    category: s.category,
    amount: s.amount,
  }));
  const total = categoryStats.reduce((sum, s) => sum + s.amount, 0);
  console.log(
    "[transactions.queries] groupByCategory — categories:",
    categoryStats.length,
    "total:",
    total,
  );
  return { categoryStats, categoryAmounts, total };
}
