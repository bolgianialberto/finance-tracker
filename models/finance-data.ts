import { CategoryAmount } from "./category-amount";
import { FinanceType } from "./finance-type";

export type FinanceData = Record<FinanceType, CategoryAmount[]>;
