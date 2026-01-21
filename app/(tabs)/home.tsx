import { InfoCard } from "@/components/card/InfoCard";
import { StatsCard } from "@/components/card/StatsCard";
import { ThemedText } from "@/components/text/themed-text";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const monthLabel = new Date().toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.externalContainer}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Dashboard</ThemedText>
        <ThemedText type="default" style={styles.month}>
          {monthLabel}
        </ThemedText>
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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 4,
  },
  month: {
    opacity: 0.6,
  },
  externalContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardView: {
    flex: 1,
  },
});
