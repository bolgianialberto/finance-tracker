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

  // Una sola query con join a categories e accounts
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      amount,
      type,
      note,
      date,
      category_id,
      category:categories (
        id,
        name,
        icon,
        color
      ),
      account:accounts (
        id,
        name
      )
    `,
    )
    .eq("user_id", userId)
    .eq("type", type)
    .is("transfer_id", null)
    .gte("date", firstDay)
    .lte("date", lastDay)
    .order("date", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) {
    return {
      categoryStats: [],
      categoryAmounts: [],
      transactions: [],
      total: 0,
    };
  }

  // Mappa le transazioni nel modello Transaction
  const transactions: Transaction[] = data.map((row: any) => ({
    id: row.id,
    categoryId: row.category_id,
    amount: row.amount,
    note: row.note ?? undefined,
    accountName: row.account?.name ?? "—",
    type: row.type,
    date: row.date,
  }));

  // Raggruppa per categoria per costruire CategoryStats e CategoryAmount
  const statsMap = new Map<string, CategoryStats>();

  for (const row of data as any[]) {
    const cat = row.category;
    if (!cat) continue;

    if (!statsMap.has(cat.id)) {
      statsMap.set(cat.id, {
        category: {
          id: cat.id,
          name: cat.name,
          icon: resolveIcon(cat.icon),
          color: cat.color,
        },
        amount: 0,
        transactionCount: 0,
      });
    }

    const entry = statsMap.get(cat.id)!;
    entry.amount += row.amount;
    entry.transactionCount += 1;
  }

  // Ordina per importo decrescente
  const categoryStats = Array.from(statsMap.values()).sort(
    (a, b) => b.amount - a.amount,
  );

  // CategoryAmount è la stessa cosa ma senza transactionCount (serve al donut chart)
  const categoryAmounts: CategoryAmount[] = categoryStats.map((s) => ({
    category: s.category,
    amount: s.amount,
  }));

  const total = categoryStats.reduce((sum, s) => sum + s.amount, 0);

  return { categoryStats, categoryAmounts, transactions, total };
}
