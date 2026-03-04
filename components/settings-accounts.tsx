import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { Account } from "@/models/account";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

type Props = {
  accounts: Account[];
  loading: boolean;
  onAddAccount?: () => void;
};

export function SettingsAccounts({ accounts, loading, onAddAccount }: Props) {
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

        {/* Divider prima del bottone aggiungi */}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pressed: {
    backgroundColor: "#F9FAFB",
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
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
    color: "#3B82F6",
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginLeft: 56,
  },
});
