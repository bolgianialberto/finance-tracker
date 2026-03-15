import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, View } from "react-native";
import { CategoryStats } from "../models/category-stats";
import { Transaction } from "../models/transaction";
import { TransactionList } from "./transactions-list";

type Props = {
  item: CategoryStats;
  isExpanded: boolean;
  transactions: Transaction[];
  onPressCategory?: (categoryId: string) => void;
  onPressTransaction?: (transaction: Transaction) => void;
};

export function CategoryLegendItem({
  item,
  isExpanded,
  transactions,
  onPressCategory,
  onPressTransaction,
}: Props) {
  const styles = useStyles();

  return (
    <View style={styles.item}>
      <Pressable
        onPress={() => onPressCategory?.(item.category.id)}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        android_ripple={{ color: "rgba(0,0,0,0.05)", borderless: false }}
      >
        <View
          style={[styles.iconWrapper, { backgroundColor: item.category.color }]}
        >
          <IconSymbol name={item.category.icon} size={16} color="#fff" />
        </View>

        <View style={styles.vertical}>
          <ThemedText style={styles.label}>{item.category.name}</ThemedText>
          <ThemedText style={styles.subLabel}>
            {item.transactionCount}{" "}
            {item.transactionCount === 1 ? "transazione" : "transazioni"}
          </ThemedText>
        </View>

        <ThemedText style={styles.amount}>
          € {item.amount.toFixed(2)}
        </ThemedText>

        <IconSymbol
          name={isExpanded ? "chevron.up" : "chevron.down"}
          size={20}
          color="#11181C"
          style={styles.chevron}
        />
      </Pressable>

      {isExpanded && (
        <TransactionList
          transactions={transactions}
          onPressTransaction={onPressTransaction}
        />
      )}
    </View>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    item: {
      paddingVertical: 10,
      borderRadius: 12,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    rowPressed: {
      opacity: 0.7,
    },
    iconWrapper: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.sm,
      borderRadius: spacing.m,
      elevation: spacing.xxs,
      shadowRadius: spacing.xs,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      marginRight: 8,
    },
    label: {
      fontWeight: "600",
    },
    subLabel: {
      fontSize: spacing.m,
      opacity: 0.5,
      marginTop: 1,
    },
    amount: {
      fontWeight: "700",
      marginRight: spacing.m,
    },
    vertical: {
      flex: 1,
    },
    chevron: {
      opacity: 0.4,
    },
  });
