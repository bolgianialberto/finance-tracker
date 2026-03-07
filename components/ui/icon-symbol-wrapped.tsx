import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import type { IconSymbolName } from "./icon-symbol";
import { IconSymbol } from "./icon-symbol";

type Props = {
  name: IconSymbolName;
  size?: number;
  backgroundColor?: string;
  iconColor: string;
};

export function IconSymbolWrapped({
  name,
  size = 24,
  backgroundColor,
  iconColor,
}: Props) {
  const styles = useStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <IconSymbol name={name} size={size} color={iconColor} />
    </View>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",

      padding: spacing.sm,
      borderRadius: spacing.m,
    },
  });
