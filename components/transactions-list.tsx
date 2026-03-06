import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { Transaction } from "../models/transaction";
import { TransactionListItem } from "./transactions-list-item";

type Props = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: Props) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {transactions.map((tx) => (
        <TransactionListItem key={tx.id} transaction={tx} />
      ))}
    </View>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
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
      fontSize: spacing.m,
      opacity: 0.6,
      marginTop: -spacing.s,
    },
    amount: {
      fontWeight: "500",
    },
  });
