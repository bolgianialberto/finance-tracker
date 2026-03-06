import { ToggleButton } from "@/components/finance-toggle-button";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { FinanceType } from "../models/finance-type";

type Props = {
  value: FinanceType;
  onChange: (value: FinanceType) => void;
  getGeneral: boolean;
  getIncome: boolean;
  getExpenses: boolean;
};

export function FinanceToggle({
  value,
  onChange,
  getGeneral,
  getIncome,
  getExpenses,
}: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {getGeneral && (
        <ToggleButton
          label="General"
          variant={value === "general" ? "selected" : "unselected"}
          onPress={() => onChange("general")}
        />
      )}
      {getExpenses && (
        <ToggleButton
          label="Expenses"
          variant={value === "expenses" ? "selected" : "unselected"}
          onPress={() => onChange("expenses")}
        />
      )}
      {getIncome && (
        <ToggleButton
          label="Income"
          variant={value === "income" ? "selected" : "unselected"}
          onPress={() => onChange("income")}
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
    container: {
      flexDirection: "row",
      borderRadius: spacing.m,
      padding: spacing.xs,
      backgroundColor: colors.toggleBackground,
    },
  });
