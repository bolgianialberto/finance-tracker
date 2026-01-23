import { ThemedText } from "@/components/ui/themed-text";
import { FinanceToggle } from "@/features/finance/components/finance-toggle";
import { FinanceType } from "@/features/finance/models/finance-type";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const [type, setType] = useState<FinanceType>("income");

  return (
    <SafeAreaView style={styles.externalContainer}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Transactions</ThemedText>
      </View>
      <View style={styles.container}>
        <FinanceToggle value={type} onChange={setType} />
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
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
