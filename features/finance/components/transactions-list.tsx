import { ThemedText } from "@/components/ui/themed-text";
import { StyleSheet, View } from "react-native";
import { Transaction } from "../models/transaction";

type Props = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: Props) {
  return (
    <View style={styles.container}>
      {transactions.map((tx) => (
        <View key={tx.id} style={styles.row}>
          <View style={styles.center}>
            <ThemedText>{tx.note || "No description"}</ThemedText>
            <ThemedText style={styles.subLabel}>{tx.accountName}</ThemedText>
          </View>

          <ThemedText style={styles.amount}>€ {tx.amount}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 40,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    flex: 1,
  },
  subLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  amount: {
    fontWeight: "500",
  },
});
