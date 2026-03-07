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
      {transactions.map((tx, index) => (
        <View key={tx.id}>
          <TransactionListItem transaction={tx} />
          {index < transactions.length - 1 && <View style={styles.divider} />}
        </View>
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
      marginTop: spacing.xs,
      borderLeftWidth: 1.5,
      borderLeftColor: colors.categoryLegendDivider,
      paddingLeft: spacing.m,
      marginHorizontal: spacing.m,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.categoryLegendDivider,
      marginVertical: 2,
    },
  });
