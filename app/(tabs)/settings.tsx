import { SettingsAccounts } from "@/components/settings-accounts";
import { SettingsCategories } from "@/components/settings-categories";
import { SettingsPreferences } from "@/components/settings-preferences";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { useSettingsData } from "@/hooks/use-account-data";
import { useCategoriesData } from "@/hooks/use-category-data";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { accounts, loadingAccounts } = useSettingsData();
  const { categories, loadingCategories } = useCategoriesData();

  return (
    <SafeAreaView style={styles.externalContainer} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Settings</ThemedText>
        <MonthLabel />
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <SettingsAccounts accounts={accounts} loading={loadingAccounts} />

          <View style={styles.sectionDivider} />

          <SettingsCategories
            categories={categories}
            loading={loadingCategories}
          />

          <View style={styles.sectionDivider} />

          <SettingsPreferences />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 4,
  },
  externalContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});
