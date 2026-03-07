import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { Transaction } from "../models/transaction";

type Props = {
  transaction: Transaction;
};

export function TransactionListItem({ transaction }: Props) {
  const styles = useStyles();

  const isNegative = transaction.type === "expense";

  return (
    <View style={styles.row}>
      <View style={styles.center}>
        <ThemedText type="captionBold" style={styles.note}>
          {transaction.note || "Nessuna descrizione"}
        </ThemedText>
        <ThemedText style={styles.subLabel}>
          {transaction.accountName}
        </ThemedText>
      </View>
      <ThemedText
        style={[styles.amount, isNegative ? styles.negative : styles.positive]}
      >
        {isNegative ? "-" : "+"} € {Math.abs(transaction.amount).toFixed(2)}
      </ThemedText>
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
      paddingVertical: spacing.xs,
    },
    center: {
      flex: 1,
      gap: 1,
    },
    note: {
      fontWeight: "600",
    },
    subLabel: {
      fontSize: spacing.m,
      opacity: 0.5,
    },
    amount: {
      fontWeight: "600",
      fontSize: spacing.m,
    },
    positive: {
      color: "#34C759",
    },
    negative: {
      color: "#FF3B30",
    },
  });
