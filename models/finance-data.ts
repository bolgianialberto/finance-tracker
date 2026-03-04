import { CategoryAmount } from "../models/category-amount";
import { FinanceType } from "../models/finance-type";

export type FinanceData = Record<FinanceType, CategoryAmount[]>;
