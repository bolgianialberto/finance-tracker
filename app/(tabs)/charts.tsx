import { ChartCard } from "@/components/card/ChartCard";
import { FinanceBarChart } from "@/components/finance-bar-chart";
import { FinanceToggle } from "@/components/finance-toggle";
import { TimeRangeToggle } from "@/components/time-range-toggle";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { useBarChartData } from "@/hooks/use-bar-chart-data";
import { useTheme } from "@/hooks/use-theme";
import { ChartType } from "@/models/chart-type";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeRange } from "../../models/time-range";

export default function ChartScreen() {
  const [type, setType] = useState<ChartType>("general");
  const [range, setRange] = useState<TimeRange>("month");
  const { data, loadMore, canLoadMore } = useBarChartData(type, range);

  const { spacing } = useTheme();

  return (
    <SafeAreaView style={styles.externalContainer}>
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
        <ThemedText type="subtitle">Charts</ThemedText>
        <MonthLabel />
      </View>
      <View
        style={[
          {
            padding: spacing.md,
            gap: spacing.md,
          },
        ]}
      >
        <FinanceToggle
          value={type}
          onChange={setType}
          getGeneral={true}
          getIncome={true}
          getExpenses={true}
        />
        <ChartCard
          header={<TimeRangeToggle value={range} onChange={setRange} />}
        >
          <FinanceBarChart
            data={data}
            range={range}
            onLoadMore={loadMore}
            canLoadMore={canLoadMore}
          />
        </ChartCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
  },
});
