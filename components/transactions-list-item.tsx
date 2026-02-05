import { ThemedText } from "@/components/ui/themed-text";
import { StyleSheet, View } from "react-native";
import { Transaction } from "../models/transaction";

type Props = {
  transaction: Transaction;
};

export function TransactionListItem({ transaction }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.center}>
        <ThemedText type={"captionBold"}>
          {transaction.note || "No description"}
        </ThemedText>
        <ThemedText style={styles.subLabel}>
          {transaction.accountName}
        </ThemedText>
      </View>
      <ThemedText style={styles.amount}>€ {transaction.amount}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 40,
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
    marginTop: -5,
  },
  amount: {
    fontWeight: "500",
  },
});
