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
};

export function CategoryLegendItem({
  item,
  isExpanded,
  transactions,
  onPressCategory,
}: Props) {
  const styles = useStyles();
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
            <IconSymbol name={item.category.icon} size={16} color="#fff" />
          </View>

          <View style={styles.vertical}>
            <ThemedText style={styles.label}>{item.category.name}</ThemedText>
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
        {isExpanded && <TransactionList transactions={categoryTransactions} />}
      </View>
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
      width: spacing.lxl,
      height: spacing.lxl,
      borderRadius: spacing.mm,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.m,
    },
    label: {},
    subLabel: {
      fontSize: spacing.m,
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
      backgroundColor: colors.categoryLegendDivider,
    },
    item: {
      paddingVertical: 8,
    },
  });
