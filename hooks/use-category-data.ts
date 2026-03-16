import { Category } from "@/models/category";
import { useRefreshOn } from "@/src/lib/refresh-events";
import { fetchCategories } from "@/src/queries/settings.queries";
import { useCallback, useEffect, useState } from "react";

export function useCategoriesData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadingCategories(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (e: any) {
      setError(e.message ?? "Errore sconosciuto");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRefreshOn(["categories"], load);

  return { categories, loadingCategories, error, refetch: load };
}
