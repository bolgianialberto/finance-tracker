import { AddTransactionSheet } from "@/components/addTransactionSheet";
import { InfoCard } from "@/components/card/InfoCard";
import { StatsCard } from "@/components/card/StatsCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useHomeData } from "@/hooks/use-home-data";
import { useTheme } from "@/hooks/use-theme";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const styles = useStyles();
  const { data, loading, refetch } = useHomeData();
  const sheetRef = useRef<BottomSheet>(null);

  function openSheet() {
    sheetRef.current?.expand();
  }

  function handleTransactionAdded() {
    // Ricarica i dati della home dopo l'inserimento
    refetch();
  }

  return (
    <SafeAreaView style={styles.externalContainer}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Dashboard</ThemedText>
        <MonthLabel />
      </View>

      <View style={styles.container}>
        <View style={styles.cards}>
          <StatsCard
            title="Total Balance"
            value={data?.totalBalance ?? 0}
            icon="dollarsign"
            variant="default"
            loading={loading}
          />

          <View style={styles.rowContainer}>
            <View style={styles.cardView}>
              <StatsCard
                title="Income"
                value={data?.income ?? 0}
                icon="arrow.up.forward"
                variant="success"
                vertical={true}
                loading={loading}
              />
            </View>
            <View style={styles.cardView}>
              <StatsCard
                title="Expenses"
                value={data?.expenses ?? 0}
                icon="arrow.down.forward"
                variant="danger"
                vertical={true}
                loading={loading}
              />
            </View>
          </View>

          <InfoCard
            title="Net Savings"
            value={data?.netSavings ?? 0}
            caption={
              data
                ? data.netSavings >= 0
                  ? "Ottimo mese! 🎉"
                  : "Attenzione alle spese 📉"
                : "..."
            }
            variant="primary"
            loading={loading}
          />
        </View>

        {/* FAB centrato sotto le card */}
        <View style={styles.fabContainer}>
          <Pressable
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            onPress={openSheet}
          >
            <IconSymbol name="plus" size={45} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Bottom Sheet */}
      <AddTransactionSheet ref={sheetRef} onSuccess={handleTransactionAdded} />
    </SafeAreaView>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    cards: {
      gap: spacing.md,
      // niente flex — occupa solo lo spazio che serve
    },
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
    fabContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    fab: {
      width: 80,
      height: 80,
      borderRadius: 50,
      backgroundColor: colors.addTransactionButton,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#6B4EFF",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 8,
    },
    fabPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.95 }],
    },
  });
