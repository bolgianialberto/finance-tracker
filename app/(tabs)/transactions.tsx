import { AddTransactionSheet } from "@/components/addTransactionSheet";
import { CategoryLegend } from "@/components/category-legend";
import { EditTransactionSheet } from "@/components/edit-transaction-sheet";
import { FinanceDonutChart } from "@/components/finance-donut-chart";
import { FinanceToggle } from "@/components/finance-toggle";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useFinanceData } from "@/hooks/use-finance-data";
import { useTheme } from "@/hooks/use-theme";
import { FinanceType } from "@/models/finance-type";
import { Transaction } from "@/models/transaction";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const [type, setType] = useState<FinanceType>("expense");
  const { data, amounts, total, transactions, refetch } = useFinanceData(type);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);

  const addSheetRef = useRef<BottomSheet>(null);
  const editSheetRef = useRef<BottomSheet>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const styles = useStyles();
  const { colors } = useTheme();

  function toggleCategory(categoryId: string) {
    setExpandedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }

  function handlePressTransaction(tx: Transaction) {
    setSelectedTransaction(tx);
    editSheetRef.current?.expand();
  }

  function handleSuccess() {
    refetch();
  }

  return (
    <View style={{ flex: 1 }}>
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

          {/* Grafico + FAB */}
          <View style={styles.chartContainer}>
            <FinanceDonutChart data={amounts} total={total} />

            {/* FAB in basso a destra del grafico */}
            <Pressable
              style={({ pressed }) => [
                styles.fab,
                { backgroundColor: colors.addTransactionButton },
                pressed && styles.fabPressed,
              ]}
              onPress={() => addSheetRef.current?.expand()}
            >
              <IconSymbol name="plus" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.legendContainer}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <CategoryLegend
              data={data}
              expandedCategoryIds={expandedCategoryIds}
              transactions={transactions}
              onPressCategory={toggleCategory}
              onPressTransaction={handlePressTransaction}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* Bottom sheets — fuori dallo ScrollView */}
      <AddTransactionSheet
        ref={addSheetRef}
        onSuccess={handleSuccess}
        initialType={type === "general" ? "expense" : type}
      />
      <EditTransactionSheet
        ref={editSheetRef}
        transaction={selectedTransaction}
        onSuccess={handleSuccess}
      />
    </View>
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
    fab: {
      position: "absolute",
      bottom: 8,
      right: 0,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#6B4EFF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 6,
    },
    fabPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.93 }],
    },
  });
