import { SettingsAccounts } from "@/components/settings-accounts";
import { SettingsCategories } from "@/components/settings-categories";
import { SettingsPreferences } from "@/components/settings-preferences";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { useSettingsData } from "@/hooks/use-account-data";
import { useCategoriesData } from "@/hooks/use-category-data";
import { useTheme } from "@/hooks/use-theme";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { accounts, loadingAccounts } = useSettingsData();
  const { categories, loadingCategories } = useCategoriesData();
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={styles.externalContainer} edges={["top"]}>
      <View
        style={[
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xs,
            gap: spacing.xs,
          },
        ]}
      >
        <ThemedText type="subtitle">Settings</ThemedText>
        <MonthLabel />
      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.settingDivider,
          },
        ]}
      />

      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.m,
              gap: spacing.md,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <SettingsAccounts accounts={accounts} loading={loadingAccounts} />

          <View
            style={[
              styles.sectionDivider,
              {
                backgroundColor: colors.settingDivider,
              },
            ]}
          />

          <SettingsCategories
            categories={categories}
            loading={loadingCategories}
          />

          <View
            style={[
              styles.sectionDivider,
              {
                backgroundColor: colors.settingDivider,
              },
            ]}
          />

          <SettingsPreferences />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
  },
  contentContainer: {
    flex: 1,
  },
  sectionDivider: {
    height: 1,
  },
});
