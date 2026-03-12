import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Account } from "@/models/account";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

type Props = {
  accounts: Account[];
  loading: boolean;
  onAddAccount?: () => void;
  onPressAccount?: (account: Account) => void;
};

export function SettingsAccounts({
  accounts,
  loading,
  onAddAccount,
  onPressAccount,
}: Props) {
  const styles = useStyles();

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 16 }} />;
  }

  return (
    <View>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Accounts
      </ThemedText>

      <View style={styles.card}>
        {accounts.map((item, index) => (
          <View key={item.id}>
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              onPress={() => onPressAccount?.(item)}
            >
              <View
                style={[styles.iconWrapper, { backgroundColor: item.color }]}
              >
                <IconSymbol name={item.icon} size={16} color="#fff" />
              </View>
              <View style={styles.vertical}>
                <ThemedText>{item.name}</ThemedText>
              </View>
              <ThemedText style={styles.amount}>€ {item.balance}</ThemedText>
              <IconSymbol
                name="chevron.right"
                size={14}
                color="#C0C0C0"
                style={{ marginLeft: 6 }}
              />
            </Pressable>
            {index < accounts.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

        {accounts.length > 0 && <View style={styles.divider} />}

        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={onAddAccount}
        >
          <View style={[styles.iconWrapper, styles.addIconWrapper]}>
            <IconSymbol name="plus" size={16} color="#3B82F6" />
          </View>
          <ThemedText style={styles.addLabel}>Add Account</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    sectionTitle: {
      color: colors.text,
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: spacing.m,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.m,
      paddingHorizontal: spacing.md,
    },
    pressed: {
      backgroundColor: colors.pressedSettingsButton,
    },
    iconWrapper: {
      width: spacing.lxl,
      height: spacing.lxl,
      borderRadius: spacing.md,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.m,
    },
    addIconWrapper: {
      backgroundColor: "#EFF6FF",
    },
    vertical: {
      flex: 1,
    },
    amount: {
      fontWeight: "600",
    },
    addLabel: {
      color: colors.addText,
      flex: 1,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.settingDivider,
      marginLeft: 56,
    },
  });
