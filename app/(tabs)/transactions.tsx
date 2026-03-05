import { CategoryLegend } from "@/components/category-legend";
import { FinanceDonutChart } from "@/components/finance-donut-chart";
import { FinanceToggle } from "@/components/finance-toggle";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { useFinanceData } from "@/hooks/use-finance-data";
import { useTheme } from "@/hooks/use-theme";
import { FinanceType } from "@/models/finance-type";
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

  const { spacing, colors } = useTheme();

  return (
    <SafeAreaView style={styles.externalContainer} edges={["top"]}>
      <View
        style={[
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xs,
            gap: spacing.xs,
          },
        ]}
      >
        <ThemedText type="subtitle">Transactions</ThemedText>
        <MonthLabel />
      </View>
      <View style={[{ padding: spacing.md, gap: spacing.md }]}>
        <FinanceToggle
          value={type}
          onChange={setType}
          getGeneral={false}
          getIncome={true}
          getExpenses={true}
        />
        <View
          style={[
            styles.divider,
            {
              backgroundColor: colors.transDivider,
            },
          ]}
        />
        <View style={styles.chartContainer}>
          <FinanceDonutChart data={data} total={total} />
        </View>
      </View>
      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.transDivider,
          },
        ]}
      />
      <View
        style={[
          styles.legendContainer,
          {
            backgroundColor: colors.transLegendBackground,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={[
            { paddingHorizontal: spacing.md, paddingBottom: spacing.m },
          ]}
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
  externalContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
  },
  legendContainer: {
    flex: 1,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
