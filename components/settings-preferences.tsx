import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

export function SettingsPreferences() {
  const [notifications, setNotifications] = useState(true);

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

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#6B7280",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  pressed: {
    backgroundColor: "#F9FAFB",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginLeft: 16,
  },
  value: {
    opacity: 0.5,
    fontSize: 14,
  },
});
