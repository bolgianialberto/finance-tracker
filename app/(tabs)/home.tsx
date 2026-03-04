import { InfoCard } from "@/components/card/InfoCard";
import { StatsCard } from "@/components/card/StatsCard";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { spacing } = useTheme();

  return (
    <SafeAreaView style={styles.externalContainer}>
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xs,
            gap: spacing.xs,
          },
        ]}
      >
        <ThemedText type="subtitle">Dashboard</ThemedText>
        <MonthLabel />
      </View>

      <View
        style={[styles.container, { padding: spacing.md, gap: spacing.md }]}
      >
        <StatsCard
          title="Total Balance"
          value={12450}
          icon="dollarsign"
          variant="default"
        />

        <View style={[styles.rowContainer, { gap: spacing.md }]}>
          <View style={styles.cardView}>
            <StatsCard
              title="Income"
              value={1879}
              icon="arrow.up.forward"
              variant="success"
              vertical={true}
            />
          </View>
          <View style={styles.cardView}>
            <StatsCard
              title="Expenses"
              value={543}
              icon="arrow.down.forward"
              variant="danger"
              vertical={true}
            />
          </View>
        </View>

        <InfoCard
          title="Net Savings"
          value={1346}
          caption="Better than the last month!"
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
  },
  header: {
    // spacing applicato inline tramite useTheme
  },
  container: {
    flex: 1,
    // spacing applicato inline tramite useTheme
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    // gap applicato inline tramite useTheme
  },
  cardView: {
    flex: 1,
  },
});
