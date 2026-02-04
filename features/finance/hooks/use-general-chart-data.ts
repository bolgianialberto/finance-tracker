import { GeneralStats } from "../models/general-stats";
import { TimeRange } from "../models/time-range";
import { Transaction } from "../models/transaction";
import { useFinanceData } from "./use-finance-data";

export function useGeneralChartData(range: TimeRange) {
  const { transactions } = useFinanceData("general");

  return aggregateTransactions(transactions, range);
}

function aggregateTransactions(
  transactions: Transaction[],
  range: TimeRange,
): GeneralStats[] {
  const map = new Map<string, GeneralStats>();

  transactions.forEach((tx) => {
    const date = new Date(tx.date);

    const label = getLabel(date, range);

    if (!map.has(label)) {
      map.set(label, {
        label,
        income: 0,
        expenses: 0,
      });
    }

    const entry = map.get(label)!;

    if (tx.type === "income") {
      entry.income += tx.amount;
    } else {
      entry.expenses += tx.amount;
    }
  });

  return Array.from(map.values()).map((item) => {
    const diff = item.income - item.expenses;

    return {
      ...item,
      profit: diff > 0 ? diff : undefined,
      loss: diff < 0 ? Math.abs(diff) : undefined,
    };
  });
}

function getLabel(date: Date, range: TimeRange) {
  switch (range) {
    case "year":
      return date.getFullYear().toString();

    case "month":
      return date.toLocaleDateString("en-US", { month: "short" });

    case "week":
      return `Week 1`; // todo: ${getWeekNumber(date)}

    case "day":
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
  }
}
