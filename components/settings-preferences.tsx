import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

export function SettingsPreferences() {
  const [notifications, setNotifications] = useState(true);
  const styles = useStyles();
  return (
    <View>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Preferences
      </ThemedText>

      <View style={styles.card}>
        <TappableRow label="Language" value="English" />
        <View style={styles.divider} />
        <TappableRow label="Currency" value="EUR" />
        <View style={styles.divider} />
        <TappableRow label="Default Account" value="Bank Account" />
        <View style={styles.divider} />

        <View style={styles.row}>
          <ThemedText style={{ flex: 1 }}>Notifications</ThemedText>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View style={styles.divider} />
        <TappableRow label="Export Data" value="CSV" />
      </View>
    </View>
  );
}

function TappableRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const styles = useStyles();

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
    >
      <ThemedText style={{ flex: 1 }}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <IconSymbol
        name="chevron.right"
        size={14}
        color="#C0C0C0"
        style={{ marginLeft: 4 }}
      />
    </Pressable>
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
      paddingVertical: spacing.mm,
      paddingHorizontal: spacing.md,
    },
    pressed: {
      backgroundColor: "#F9FAFB",
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.settingDivider,
      marginLeft: spacing.md,
    },
    value: {
      opacity: 0.5,
      fontSize: spacing.mm,
    },
  });
