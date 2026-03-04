import { ThemedText } from "@/components/ui/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { TIME_TOGGLE_STYLES, ToggleVariant } from "@/variant/toggle.styles";
import { Pressable, StyleSheet } from "react-native";

type Props = {
  label: string;
  variant: ToggleVariant;
  onPress: () => void;
};

export function TimeToggleButton({ label, variant, onPress }: Props) {
  const styleTokens = TIME_TOGGLE_STYLES[variant];
  const { colors } = useTheme();
  const textColor = colors[styleTokens.text];

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <ThemedText style={[styles.text, { color: textColor }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
