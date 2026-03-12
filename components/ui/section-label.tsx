import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text } from "react-native";
import { ThemedText } from "./themed-text";

type Props = {
  label: string;
  optional?: boolean;
};

/**
 * Label di sezione usata nei form.
 * Esempio: <SectionLabel label="Category" optional />
 */
export function SectionLabel({ label, optional = false }: Props) {
  const { colors } = useTheme();

  return (
    <ThemedText
      type="captionBold"
      style={[{ color: colors.text }, styles.label]}
    >
      {label}
      {optional && <Text style={styles.optional}> (optional)</Text>}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  label: {
    letterSpacing: 0.3,
    marginLeft: 4,
  },
  optional: {
    fontWeight: "400",
    opacity: 0.5,
    fontSize: 13,
  },
});
