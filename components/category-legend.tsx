import { Colors, Spacing } from "@/constants/theme";
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
};

export function CategoryLegend({
  data,
  expandedCategoryIds,
  transactions,
  onPressCategory,
}: Props) {
  const styles = useStyles();

  return (
    <View>
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
            />
            {/* DIVIDER (non sull'ultimo) */}
            {index < data.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconWrapper: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    label: {},
    subLabel: {
      fontSize: 12,
      opacity: 0.6,
      marginTop: -5,
    },
    amount: {
      fontWeight: "600",
    },
    vertical: {
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: "#ccccccff",
    },
    item: {
      paddingVertical: 8, // 🔥 spazio sopra E sotto
    },
  });
