import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { CategoryStats } from "../models/category-stats";
import { Transaction } from "../models/transaction";
import { CategoryLegendItem } from "./category-legend-item";

type Props = {
  data: CategoryStats[];
  expandedCategoryIds: string[];
  transactions: Transaction[];
  onPressCategory?: (categoryId: string) => void;
  onPressTransaction?: (transaction: Transaction) => void;
};

export function CategoryLegend({
  data,
  expandedCategoryIds,
  transactions,
  onPressCategory,
  onPressTransaction,
}: Props) {
  const styles = useStyles();

  return (
    <View style={styles.content}>
      {data.map((item, index) => {
        const isExpanded = expandedCategoryIds.includes(item.category.id);
        const categoryTransactions = transactions.filter(
          (tx) => tx.categoryId === item.category.id,
        );
        return (
          <View key={item.category.id}>
            <CategoryLegendItem
              item={item}
              isExpanded={isExpanded}
              transactions={categoryTransactions}
              onPressCategory={onPressCategory}
              onPressTransaction={onPressTransaction}
            />
            {index < data.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
}

const useStyles = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    content: {
      paddingVertical: 4,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.categoryLegendDivider,
      marginHorizontal: 8,
    },
  });
};
