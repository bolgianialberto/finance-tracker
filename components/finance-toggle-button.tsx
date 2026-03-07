import { Colors, Spacing } from "@/constants/theme";
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
  const styles = useStyles();
  const { colors } = useTheme();
  const textColor = colors[styleTokens.text];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <ThemedText style={[styles.label, { color: textColor }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    button: {
      flex: 1,
      paddingVertical: spacing.m,
      alignItems: "center",
      borderRadius: spacing.sm,
      // Niente backgroundColor: la pill sotto ci pensa
      zIndex: 1, // bottone sopra la pill per ricevere i touch
    },
    pressed: {
      opacity: 0.7,
    },
    label: {
      fontWeight: "500",
    },
  });
