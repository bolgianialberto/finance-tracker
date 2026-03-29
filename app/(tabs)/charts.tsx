import { ChartCard } from "@/components/card/ChartCard";
import { FinanceBarChart } from "@/components/chart/finance-bar-chart";
import { FinanceToggle } from "@/components/finance-toggle";
import { TimeRangeToggle } from "@/components/time-range-toggle";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
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

  const styles = useStyles();

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
            type={type}
          />
        </ChartCard>
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
    externalContainer: {
      flex: 1,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xs,
      gap: spacing.xs,
    },
    container: {
      padding: spacing.md,
      gap: spacing.md,
    },
  });
