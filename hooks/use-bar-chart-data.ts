import { FinanceBarModel } from "../models/finance-bar-model";
import { FinanceType } from "../models/finance-type";
import { TimeRange } from "../models/time-range";
import { Transaction } from "../models/transaction";
import { useFinanceData } from "./use-finance-data";

export function useBarChartData(dataType: FinanceType, range: TimeRange) {
  const { transactions } = useFinanceData(dataType);

  return aggregateTransactions(transactions, range);
}

function aggregateTransactions(
  transactions: Transaction[],
  range: TimeRange,
): FinanceBarModel[] {
  const map = new Map<string, FinanceBarModel>();

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const bucketDate = getBucketDate(txDate, range);
    const key = getBucketKey(bucketDate, range);

    if (!map.has(key)) {
      map.set(key, {
        label: getLabel(bucketDate, range),
        income: 0,
        expenses: 0,
        result: 0,
        date: bucketDate,
      });
    }

    const entry = map.get(key)!;

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
      const day = d.getDay() || 7; // lunedì = 1
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
      return date.toISOString().slice(0, 10);

    case "week":
      return `${date.getFullYear()}-W1}`;

    case "month":
      return `${date.getFullYear()}-${date.getMonth()}`;

    case "year":
      return date.getFullYear().toString();
  }
}

function getLabel(date: Date, range: TimeRange) {
  switch (range) {
    case "year":
      return date.getFullYear().toString();

    case "month":
      return date.toLocaleDateString("en-US", { month: "short" });

    case "week":
      return `W1`;

    case "day":
      return date.getDate().toString();
  }
}
