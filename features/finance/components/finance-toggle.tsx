import { ToggleButton } from "@/components/toggle-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import { FinanceType } from "../models/finance-type";

type Props = {
  value: FinanceType;
  onChange: (value: FinanceType) => void;
};

export function FinanceToggle({ value, onChange }: Props) {
  const bg = useThemeColor({}, "toggleBackground");

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ToggleButton
        label="Expenses"
        variant={value === "expenses" ? "selected" : "unselected"}
        onPress={() => onChange("expenses")}
      />
      <ToggleButton
        label="Income"
        variant={value === "income" ? "selected" : "unselected"}
        onPress={() => onChange("income")}
      />
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
