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

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    container: {
      paddingLeft: spacing.xxl,
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
      marginTop: -5,
    },
    amount: {
      fontWeight: "500",
    },
  });
