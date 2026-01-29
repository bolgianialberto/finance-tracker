import { StyleSheet, View } from "react-native";
import { Transaction } from "../models/transaction";
import { TransactionListItem } from "./transactions-list-item";

type Props = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: Props) {
  return (
    <View style={styles.container}>
      {transactions.map((tx) => (
        <TransactionListItem key={tx.id} transaction={tx} />
      ))}
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
