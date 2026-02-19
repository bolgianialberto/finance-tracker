import { ChartCard } from "@/components/card/ChartCard";
import { FinanceBarChart } from "@/components/finance-bar-chart";
import { FinanceToggle } from "@/components/finance-toggle";
import { TimeRangeToggle } from "@/components/time-range-toggle";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { useBarChartData } from "@/hooks/use-bar-chart-data";
import { ChartType } from "@/models/chart-type";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TimeRange } from "../../models/time-range";

export default function ChartScreen() {
  const [type, setType] = useState<ChartType>("general");
  const [range, setRange] = useState<TimeRange>("month");
  const { data, loadMore, canLoadMore } = useBarChartData(type, range);

  return (
    <SafeAreaView style={styles.externalContainer}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Charts</ThemedText>
        <MonthLabel />
      </View>
      <View style={styles.container}>
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
});
