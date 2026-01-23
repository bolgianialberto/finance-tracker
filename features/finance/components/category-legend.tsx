import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { StyleSheet, View } from "react-native";
import type { CategoryAmount } from "../models/category-amount";

type Props = {
  data: CategoryAmount[];
};

export function CategoryLegend({ data }: Props) {
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.category.id} style={styles.row}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: item.category.color },
            ]}
          >
            <IconSymbol name={item.category.icon} size={16} color="#fff" />
          </View>

          <ThemedText style={styles.label}>{item.category.name}</ThemedText>

          <ThemedText style={styles.amount}>€ {item.amount}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    flex: 1,
  },
  amount: {
    fontWeight: "600",
  },
});
