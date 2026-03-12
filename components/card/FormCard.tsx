import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
  children: React.ReactNode;
  error?: boolean;
};

/**
 * Card contenitore per sezioni di form.
 * Usa lo stesso stile delle card in SettingsAccounts/Categories.
 */
export function FormCard({ children, style, error, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background },
        error && styles.cardError,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  cardError: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EF4444",
  },
});
