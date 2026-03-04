import { useEffect, useState } from "react";
import { mockCategories } from "../data/category.mock";
import { Category } from "../models/category";

export function useCategoriesData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    setLoadingCategories(true);

    // 🔁 oggi mock
    setCategories(mockCategories);

    setLoadingCategories(false);

    // 🚀 domani:
    // fetch("/api/accounts")
  }, []);

  return {
    categories,
    loadingCategories,
  };
}
