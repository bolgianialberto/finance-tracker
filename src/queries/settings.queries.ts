import { resolveIcon } from "@/constants/icon-map";
import { Account } from "@/models/account";
import { Category, CategoryType } from "@/models/category";
import { emitRefresh } from "@/src/lib/refresh-events";
import { supabase } from "@/src/lib/supabase";

async function getUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utente non loggato");
  return user.id;
}

// ─── Accounts ─────────────────────────────────────────────────────────────────

export async function fetchAccounts(): Promise<Account[]> {
  console.log("[settings.queries] fetchAccounts — start");
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("accounts")
    .select("id, name, balance, color")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[settings.queries] fetchAccounts — error", error);
    throw error;
  }

  console.log(
    "[settings.queries] fetchAccounts — result:",
    data?.length,
    "accounts",
  );
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    balance: row.balance,
    color: row.color,
  }));
}

export async function insertAccount({
  name,
  color,
  initialBalance,
}: {
  name: string;
  color: string;
  initialBalance: number;
}): Promise<void> {
  console.log("[settings.queries] insertAccount — start", {
    name,
    color,
    initialBalance,
  });
  const userId = await getUserId();

  const { error } = await supabase.from("accounts").insert({
    user_id: userId,
    name: name.trim(),
    color,
    icon: "wallet",
    initial_balance: initialBalance,
    balance: initialBalance,
    is_default: false,
    is_archived: false,
  });

  if (error) {
    console.error("[settings.queries] insertAccount — error", error);
    throw error;
  }

  console.log("[settings.queries] insertAccount — success, emitting refresh");
  emitRefresh("accounts");
}

export async function updateAccount({
  id,
  name,
  color,
}: {
  id: string;
  name: string;
  color: string;
}): Promise<void> {
  console.log("[settings.queries] updateAccount — start", { id, name, color });

  const { error } = await supabase
    .from("accounts")
    .update({ name: name.trim(), color })
    .eq("id", id);

  if (error) {
    console.error("[settings.queries] updateAccount — error", error);
    throw error;
  }

  console.log("[settings.queries] updateAccount — success, emitting refresh");
  emitRefresh("accounts");
}

export async function deleteAccount(id: string): Promise<void> {
  console.log("[settings.queries] deleteAccount — start", { id });

  const { error } = await supabase
    .from("accounts")
    .update({ is_archived: true })
    .eq("id", id);

  if (error) {
    console.error("[settings.queries] deleteAccount — error", error);
    throw error;
  }

  console.log("[settings.queries] deleteAccount — success, emitting refresh");
  emitRefresh("accounts");
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  console.log("[settings.queries] fetchCategories — start");
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon, color, type, user_id, created_at")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .eq("is_archived", false)
    .order("user_id", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[settings.queries] fetchCategories — error", error);
    throw error;
  }

  console.log(
    "[settings.queries] fetchCategories — result:",
    data?.length,
    "categories",
  );
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    icon: resolveIcon(row.icon),
    iconKey: row.icon,
    color: row.color,
    type: row.type,
    isGlobal: row.user_id === null,
  }));
}

export async function insertCategory({
  name,
  iconKey,
  color,
  type,
}: {
  name: string;
  iconKey: string;
  color: string;
  type: CategoryType;
}): Promise<void> {
  console.log("[settings.queries] insertCategory — start", {
    name,
    iconKey,
    color,
    type,
  });
  const userId = await getUserId();

  const { error } = await supabase.from("categories").insert({
    user_id: userId,
    name: name.trim(),
    icon: iconKey,
    color,
    type,
    is_archived: false,
  });

  if (error) {
    console.error("[settings.queries] insertCategory — error", error);
    throw error;
  }

  console.log("[settings.queries] insertCategory — success, emitting refresh");
  emitRefresh("categories");
}

export async function updateCategory({
  id,
  name,
  iconKey,
  color,
  type,
}: {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  type: CategoryType;
}): Promise<void> {
  console.log("[settings.queries] updateCategory — start", {
    id,
    name,
    iconKey,
    color,
    type,
  });

  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim(), icon: iconKey, color, type })
    .eq("id", id);

  if (error) {
    console.error("[settings.queries] updateCategory — error", error);
    throw error;
  }

  console.log("[settings.queries] updateCategory — success, emitting refresh");
  emitRefresh("categories");
}

export async function deleteCategory(id: string): Promise<void> {
  console.log("[settings.queries] deleteCategory — start", { id });

  const { error } = await supabase
    .from("categories")
    .update({ is_archived: true })
    .eq("id", id);

  if (error) {
    console.error("[settings.queries] deleteCategory — error", error);
    throw error;
  }

  console.log("[settings.queries] deleteCategory — success, emitting refresh");
  emitRefresh("categories");
}
