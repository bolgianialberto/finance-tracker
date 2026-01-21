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
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <IconSymbol name={name} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",

    // Android
    elevation: 3,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
