import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { CategoryLegend } from "@/features/finance/components/category-legend";
import { FinanceDonutChart } from "@/features/finance/components/finance-donut-chart";
import { FinanceToggle } from "@/features/finance/components/finance-toggle";
import { useFinanceData } from "@/features/finance/hooks/use-finance-data";
import { FinanceType } from "@/features/finance/models/finance-type";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const [type, setType] = useState<FinanceType>("expenses");
  const { data, total, transactions } = useFinanceData(type);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryIds(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // chiudi
          : [...prev, categoryId], // apri
    );
  };

  return (
    <SafeAreaView style={styles.externalContainer} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Transactions</ThemedText>
        <MonthLabel />
      </View>
      <View style={styles.container}>
        <FinanceToggle value={type} onChange={setType} />
        <View style={styles.divider} />
        <View style={styles.chartContainer}>
          <FinanceDonutChart data={data} total={total} />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.legendContainer}>
        <ScrollView
          contentContainerStyle={styles.legendContent}
          showsVerticalScrollIndicator={false}
        >
          <CategoryLegend
            data={data}
            expandedCategoryIds={expandedCategoryIds}
            transactions={transactions}
            onPressCategory={toggleCategory}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 4,
  },
  externalContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  legendContainer: {
    flex: 1, // 🔥 prende tutto lo spazio rimasto
    backgroundColor: "#E5E7EB",
  },
  legendContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
