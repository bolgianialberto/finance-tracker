import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, StyleSheet } from "react-native";
import {
  FINANCE_TOGGLE_STYLES,
  ToggleVariant,
} from "../../../components/toggle.styles";
import { ThemedText } from "../../../components/ui/themed-text";

type Props = {
  label: string;
  onPress: () => void;
  variant: ToggleVariant;
};

export function ToggleButton({ label, variant, onPress }: Props) {
  const styleTokens = FINANCE_TOGGLE_STYLES[variant];

  const backgroundColor = useThemeColor({}, styleTokens.background);
  const textColor = useThemeColor({}, styleTokens.text);

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
