import { InfoCard } from "@/components/card/InfoCard";
import { StatsCard } from "@/components/card/StatsCard";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.externalContainer}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Dashboard</ThemedText>
        <MonthLabel />
      </View>

      <View style={styles.container}>
        <StatsCard
          title="Total Balance"
          value={12450}
          icon="dollarsign"
          variant="default"
        />

        <View style={styles.rowContainer}>
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
    container: {
      flex: 1,
      padding: spacing.md,
      gap: spacing.md,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    cardView: {
      flex: 1,
    },
  });
