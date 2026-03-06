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
  const { spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          padding: spacing.sm,
          borderRadius: spacing.m,
          elevation: spacing.xxs,
          shadowRadius: spacing.xs,
        },
      ]}
    >
      <IconSymbol name={name} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
});
