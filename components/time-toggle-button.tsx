import { ThemedText } from "@/components/ui/themed-text";
import {
  TIME_TOGGLE_STYLES,
  ToggleVariant,
} from "@/constants/styles/toggle.styles";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
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
  const styles = useStyles();

  return (
    <Pressable onPress={onPress} style={styles.button}>
      <ThemedText style={[styles.text, { color: textColor }]}>
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
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: spacing.mm,
      letterSpacing: 0.4,
    },
  });
