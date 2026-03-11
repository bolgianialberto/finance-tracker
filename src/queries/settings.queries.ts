import { resolveIcon } from "@/constants/icon-map";
import { Account } from "@/models/account";
import { Category } from "@/models/category";
import { supabase } from "@/src/lib/supabase";

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utente non loggato");
  return user.id;
}

export async function fetchAccounts(): Promise<Account[]> {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("accounts")
    .select("id, name, balance, icon, color")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    balance: row.balance,
    icon: resolveIcon(row.icon),
    color: row.color,
  }));
}

export async function fetchCategories(): Promise<Category[]> {
  const userId = await getUserId();

  // Prende le categorie globali (user_id IS NULL) + quelle dell'utente
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon, color, type")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .eq("is_archived", false)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    icon: resolveIcon(row.icon),
    color: row.color,
    type: row.type,
  }));
}
