import { SettingsAccounts } from "@/components/settings-accounts";
import { SettingsCategories } from "@/components/settings-categories";
import { SettingsPreferences } from "@/components/settings-preferences";
import { MonthLabel } from "@/components/ui/month-label";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useAccountsData } from "@/hooks/use-account-data";
import { useCategoriesData } from "@/hooks/use-category-data";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/src/lib/supabase";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { accounts, loadingAccounts } = useAccountsData();
  const { categories, loadingCategories } = useCategoriesData();
  const styles = useStyles();

  async function handleSignOut() {
    Alert.alert("Esci", "Sei sicuro di voler uscire?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Esci",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          // Il _layout.tsx rileva la sessione nulla e reindirizza al login
        },
      },
    ]);
  }

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

          <View style={styles.sectionDivider} />

          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.signOutText}>Sign out</ThemedText>
          </TouchableOpacity>
        </ScrollView>
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
    content: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.m,
      gap: spacing.md,
    },
    externalContainer: {
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: colors.settingDivider,
    },
    contentContainer: {
      flex: 1,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: colors.settingDivider,
    },
    signOutBtn: {
      paddingVertical: spacing.sm,
      alignItems: "center",
    },
    signOutText: {
      color: "#ef4444",
      fontWeight: "600",
      fontSize: 16,
    },
  });
