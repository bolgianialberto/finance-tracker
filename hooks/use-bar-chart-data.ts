import { FinanceBarModel } from "@/models/finance-bar-model";
import { FinanceType } from "@/models/finance-type";
import { TimeRange } from "@/models/time-range";
import { Transaction } from "@/models/transaction";
import { fetchAllTransactions } from "@/src/queries/transactions.queries";
import { useCallback, useEffect, useMemo, useState } from "react";

const INITIAL_LOAD_COUNT = 5;
const LOAD_MORE_COUNT = 15;

export function useBarChartData(dataType: FinanceType, range: TimeRange) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica le transazioni da Supabase ogni volta che cambia tipo o range
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllTransactions(dataType);
        if (!cancelled) setTransactions(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Errore sconosciuto");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [dataType]); // range non serve qui — le transazioni sono tutte, il range è solo per l'aggregazione

  // Genera tutti i bucket vuoti dall'intervallo delle transazioni
  const allBuckets = useMemo(() => {
    if (!transactions.length) return [];

    const dates = transactions.map((t) => new Date(t.date));
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    return generateEmptyBuckets(minDate, maxDate, range);
  }, [transactions, range]);

  const [loadedRange, setLoadedRange] = useState({
    start: Math.max(0, allBuckets.length - INITIAL_LOAD_COUNT),
    end: allBuckets.length,
  });

  // Reset dello scroll quando cambia range o dati
  useEffect(() => {
    setLoadedRange({
      start: Math.max(0, allBuckets.length - INITIAL_LOAD_COUNT),
      end: allBuckets.length,
    });
  }, [allBuckets.length, range]);

  const visibleData = useMemo(() => {
    const bucketsToLoad = allBuckets.slice(loadedRange.start, loadedRange.end);
    return aggregateTransactionsForBuckets(bucketsToLoad, transactions, range);
  }, [allBuckets, loadedRange, transactions, range]);

  const loadMore = useCallback(
    (direction: "left" | "right") => {
      setLoadedRange((prev) => {
        if (direction === "left") {
          return { ...prev, start: Math.max(0, prev.start - LOAD_MORE_COUNT) };
        } else {
          return {
            ...prev,
            end: Math.min(allBuckets.length, prev.end + LOAD_MORE_COUNT),
          };
        }
      });
    },
    [allBuckets.length],
  );

  const canLoadMore = useMemo(
    () => ({
      left: loadedRange.start > 0,
      right: loadedRange.end < allBuckets.length,
    }),
    [loadedRange, allBuckets.length],
  );

  return { data: visibleData, loadMore, canLoadMore, loading, error };
}

// --- Helpers (stessa logica dei mock, invariata) ---

function aggregateTransactionsForBuckets(
  buckets: FinanceBarModel[],
  transactions: Transaction[],
  range: TimeRange,
): FinanceBarModel[] {
  const map = new Map<string, FinanceBarModel>();
  buckets.forEach((bucket) => {
    map.set(getBucketKey(bucket.date, range), { ...bucket });
  });

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const bucketDate = getBucketDate(txDate, range);
    const key = getBucketKey(bucketDate, range);
    const entry = map.get(key);
    if (!entry) return;

    if (tx.type === "income") {
      entry.income += tx.amount;
      entry.result! += tx.amount;
    } else {
      entry.expenses += tx.amount;
      entry.result! -= tx.amount;
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}

function getBucketDate(date: Date, range: TimeRange): Date {
  const d = new Date(date);
  switch (range) {
    case "day":
      d.setHours(0, 0, 0, 0);
      return d;
    case "week": {
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - day + 1);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "month":
      return new Date(d.getFullYear(), d.getMonth(), 1);
    case "year":
      return new Date(d.getFullYear(), 0, 1);
  }
}

function getBucketKey(date: Date, range: TimeRange): string {
  switch (range) {
    case "day":
    case "week":
      return date.toISOString().slice(0, 10);
    case "month":
      return `${date.getFullYear()}-${date.getMonth()}`;
    case "year":
      return date.getFullYear().toString();
  }
}

function getLabel(date: Date, range: TimeRange): string {
  switch (range) {
    case "year":
      return date.getFullYear().toString();
    case "month":
      return date.toLocaleDateString("en-US", { month: "short" });
    case "week":
      return date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
      });
    case "day":
      return date.getDate().toString(); // tieni solo il numero qui
  }
}

export function getDaySubLabel(date: Date, range: TimeRange): string | null {
  if (range !== "day") return null;
  return date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue"...
}

function generateEmptyBuckets(
  start: Date,
  end: Date,
  range: TimeRange,
): FinanceBarModel[] {
  const buckets: FinanceBarModel[] = [];
  let current = getBucketDate(start, range);

  while (current <= end) {
    buckets.push({
      label: getLabel(current, range),
      subLabel:
        range === "day"
          ? current.toLocaleDateString("en-US", { weekday: "short" })
          : undefined,
      income: 0,
      expenses: 0,
      result: 0,
      date: new Date(current),
    });

    switch (range) {
      case "day":
        current.setDate(current.getDate() + 1);
        break;
      case "week":
        current.setDate(current.getDate() + 7);
        break;
      case "month":
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        break;
      case "year":
        current = new Date(current.getFullYear() + 1, 0, 1);
        break;
    }
  }

  return buckets;
}
