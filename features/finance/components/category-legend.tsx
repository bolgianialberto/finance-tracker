import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { Pressable, StyleSheet, View } from "react-native";
import { CategoryStats } from "../models/category-stats";
import { Transaction } from "../models/transaction";
import { TransactionList } from "./transactions-list";

type Props = {
  data: CategoryStats[];
  expandedCategoryId: string | null;
  transactions: Transaction[];
  onPressCategory?: (categoryId: string) => void;
};

export function CategoryLegend({
  data,
  expandedCategoryId,
  transactions,
  onPressCategory,
}: Props) {
  return (
    <View>
      {data.map((item, index) => {
        const isExpanded = item.category.id === expandedCategoryId;
        const categoryTransactions = transactions.filter(
          (tx) => tx.categoryId === item.category.id,
        );
        return (
          <View key={item.category.id}>
            <View style={styles.item}>
              <Pressable
                onPress={() => onPressCategory?.(item.category.id)}
                style={styles.row}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: item.category.color },
                  ]}
                >
                  <IconSymbol
                    name={item.category.icon}
                    size={16}
                    color="#fff"
                  />
                </View>

                <View style={styles.vertical}>
                  <ThemedText style={styles.label}>
                    {item.category.name}
                  </ThemedText>
                  <ThemedText style={styles.subLabel}>
                    {item.transactionCount} transactions
                  </ThemedText>
                </View>
                <ThemedText style={styles.amount}>€ {item.amount}</ThemedText>
                <IconSymbol
                  name={isExpanded ? "chevron.up" : "chevron.down"}
                  size={24}
                  color="#11181C"
                />
              </Pressable>
              {isExpanded && (
                <TransactionList transactions={categoryTransactions} />
              )}
            </View>
            {/* DIVIDER (non sull'ultimo) */}
            {index < data.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
