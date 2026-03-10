import { CategoryLegend } from "@/components/category-legend";
import { FinanceDonutChart } from "@/components/finance-donut-chart";
import { FinanceToggle } from "@/components/finance-toggle";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useFinanceData } from "@/hooks/use-finance-data";
import { useTheme } from "@/hooks/use-theme";
import { FinanceType } from "@/models/finance-type";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const [type, setType] = useState<FinanceType>("expense");
  const { data, amounts, total, transactions } = useFinanceData(type);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const styles = useStyles();

  return (
    <SafeAreaView style={styles.externalContainer} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Transactions</ThemedText>
        <MonthLabel />
      </View>
      <View style={styles.content}>
        <FinanceToggle
          value={type}
          onChange={setType}
          getGeneral={false}
          getIncome={true}
          getExpenses={true}
        />
        <View style={styles.divider} />
        <View style={styles.chartContainer}>
          {/* amounts va al donut (CategoryAmount[]) */}
          <FinanceDonutChart data={amounts} total={total} />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.legendContainer}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* data va alla legend (CategoryStats[]) */}
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

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xs,
      gap: spacing.xs,
    },
    externalContainer: {
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: colors.transDivider,
    },
    legendContainer: {
      flex: 1,
      backgroundColor: colors.transLegendBackground,
    },
    chartContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.m,
    },
    content: {
      padding: spacing.md,
      gap: spacing.md,
    },
  });
