import { resolveIcon } from "@/constants/icon-map";
import { CategoryAmount } from "@/models/category-amount";
import { CategoryStats } from "@/models/category-stats";
import { FinanceType } from "@/models/finance-type";
import { Transaction } from "@/models/transaction";
import { supabase } from "@/src/lib/supabase";

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utente non loggato");
  return user.id;
}

function getMonthRange(): { firstDay: string; lastDay: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
  return { firstDay, lastDay };
}

// Schermata Transactions — solo mese corrente, filtrata per tipo
export async function fetchTransactionsData(
  type: Exclude<FinanceType, "general">,
): Promise<{
  categoryStats: CategoryStats[];
  categoryAmounts: CategoryAmount[];
  transactions: Transaction[];
  total: number;
}> {
  const userId = await getUserId();
  const { firstDay, lastDay } = getMonthRange();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id, amount, type, note, date, category_id,
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

  if (error) throw error;
  if (!data || data.length === 0)
    return {
      categoryStats: [],
      categoryAmounts: [],
      transactions: [],
      total: 0,
    };

  const transactions = mapToTransactions(data);
  const { categoryStats, categoryAmounts, total } = groupByCategory(data);
  return { categoryStats, categoryAmounts, transactions, total };
}

// Schermata Charts — TUTTE le transazioni, nessun filtro mese
export async function fetchAllTransactions(
  type: FinanceType,
): Promise<Transaction[]> {
  const userId = await getUserId();

  let query = supabase
    .from("transactions")
    .select(
      `
      id, amount, type, note, date, category_id,
      account:accounts ( id, name )
    `,
    )
    .eq("user_id", userId)
    .is("transfer_id", null)
    .order("date", { ascending: true });

  if (type !== "general") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ? mapToTransactions(data) : [];
}

// Inserisce una nuova transazione
export async function insertTransaction(params: {
  amount: number;
  type: Exclude<FinanceType, "general">;
  categoryId: string;
  categoryName: string; // usato come nota di default se note è vuota
  accountId: string;
  date: string; // formato YYYY-MM-DD
  note?: string;
}): Promise<void> {
  const userId = await getUserId();

  // Se la nota è vuota usa il nome della categoria come titolo generico
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

  if (error) throw error;
}

// --- Helpers condivisi ---

function mapToTransactions(data: any[]): Transaction[] {
  return data.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
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
          color: cat.color,
          type: cat.type,
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
  return { categoryStats, categoryAmounts, total };
}
