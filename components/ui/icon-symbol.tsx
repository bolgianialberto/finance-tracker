import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * Mappa SF Symbols → Material Icons.
 * Aggiungere nuove icone qui seguendo la stessa convenzione.
 * Ref: https://icons.expo.fyi  |  https://developer.apple.com/sf-symbols/
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "keyboard-arrow-down",
  "chevron.up": "keyboard-arrow-up",
  "receipt.fill": "receipt",
  "chart.bar.xaxis": "bar-chart",
  "gearshape.fill": "settings",
  dollarsign: "attach-money",
  "arrow.up.forward": "trending-up",
  "arrow.down.forward": "trending-down",
  // Aggiunge icone utili di base
  "plus.circle.fill": "add-circle",
  "minus.circle.fill": "remove-circle",
  "xmark.circle.fill": "cancel",
  "checkmark.circle.fill": "check-circle",
} as IconMapping;

type Props = {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight; // ignorato su Android/web, mantenuto per compatibilità iOS
};

/**
 * Componente icona cross-platform.
 * Usa SF Symbols su iOS e Material Icons su Android/web.
 */
export function IconSymbol({ name, size = 24, color, style }: Props) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
