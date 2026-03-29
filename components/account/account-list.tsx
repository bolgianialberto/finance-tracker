import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/hooks/use-theme";
import { Account } from "@/models/account";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  accounts: Account[];
  selectedId: string | null;
  onPress: (account: Account) => void;
  error?: boolean;
};

/**
 * Lista account per la selezione nella modale AddTransaction.
 * Layout semplice: pallino colorato + nome + checkmark se selezionato.
 */
export function AccountList({ accounts, selectedId, onPress, error }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background },
        error && {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "#EF4444",
        },
      ]}
    >
      {accounts.map((acc, index) => {
        const isSelected = selectedId === acc.id;
        const isLast = index === accounts.length - 1;

        return (
          <View key={acc.id}>
            <Pressable
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
              onPress={() => onPress(acc)}
            >
              <View style={[styles.dot, { backgroundColor: acc.color }]} />
              <Text
                style={[
                  styles.name,
                  { color: colors.text },
                  isSelected && { fontWeight: "700" },
                ]}
              >
                {acc.name}
              </Text>
              {isSelected && (
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={18}
                  color="#22C55E"
                />
              )}
            </Pressable>
            {!isLast && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.settingDivider, marginLeft: 38 },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    flex: 1,
    fontSize: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
