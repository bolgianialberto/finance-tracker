import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet } from "react-native";
import { FINANCE_TOGGLE_STYLES, ToggleVariant } from "../variant/toggle.styles";
import { ThemedText } from "./ui/themed-text";

type Props = {
  label: string;
  onPress: () => void;
  variant: ToggleVariant;
};

export function ToggleButton({ label, variant, onPress }: Props) {
  const styleTokens = FINANCE_TOGGLE_STYLES[variant];

  const { colors } = useTheme();
  const backgroundColor = colors[styleTokens.background];
  const textColor = colors[styleTokens.text];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: backgroundColor }]}
    >
      <ThemedText style={{ color: textColor }}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
});
