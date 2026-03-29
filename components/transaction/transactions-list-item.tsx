import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Transaction } from "@/models/transaction";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export function TransactionListItem({ transaction, onPress }: Props) {
  const styles = useStyles();
  const isNegative = transaction.type === "expense";

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
      onPress={onPress}
    >
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
    </Pressable>
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
