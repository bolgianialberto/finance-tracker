import { ChartCard } from "@/components/card/ChartCard";
import { TimeRangeToggle } from "@/components/time-range-toggle";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { FinanceToggle } from "@/features/finance/components/finance-toggle";
import { useFinanceData } from "@/features/finance/hooks/use-finance-data";
import { ChartType } from "@/features/finance/models/chart-type";
import { TimeRange } from "@/features/finance/models/time-range";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChartScreen() {
  const [type, setType] = useState<ChartType>("general");
  const [range, setRange] = useState<TimeRange>("month");
  const { data, total, transactions } = useFinanceData(type);

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
          <View />
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
