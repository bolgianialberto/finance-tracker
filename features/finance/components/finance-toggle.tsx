import { ToggleButton } from "@/features/finance/components/finance-toggle-button";
import { useThemeColor } from "@/hooks/use-theme-color";
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
  const bg = useThemeColor({}, "toggleBackground");

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
});
