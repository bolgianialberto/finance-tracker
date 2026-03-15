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
  // UI generica
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
  "plus.circle.fill": "add-circle",
  "minus.circle.fill": "remove-circle",
  "xmark.circle.fill": "cancel",
  "checkmark.circle.fill": "check-circle",
  checkmark: "check",
  plus: "add",

  // Categorie esistenti
  "house.fill": "home",
  "fork.knife": "restaurant",
  "car.fill": "directions-car",
  "heart.fill": "favorite",
  "gamecontroller.fill": "sports-esports",
  "bag.fill": "shopping-bag",
  "arrow.clockwise": "autorenew",
  "bolt.fill": "bolt",
  "graduationcap.fill": "school",
  airplane: "flight",
  "briefcase.fill": "work",
  laptopcomputer: "laptop",
  "chart.line.uptrend.xyaxis": "trending-up",
  "gift.fill": "card-giftcard",
  "tag.fill": "label",

  // Categorie nuove
  "figure.run": "directions-run",
  "music.note": "music-note",
  "cup.and.saucer.fill": "coffee-maker",
  "pawprint.fill": "pets",
  "phone.fill": "phone",
  "camera.fill": "camera-alt",
  "book.fill": "menu-book",
  "star.fill": "star",
  "flag.fill": "flag",
  "map.fill": "map",
  "building.columns.fill": "account-balance",
  "banknote.fill": "payments",
  "wallet.pass.fill": "account-balance-wallet",
  "pills.fill": "medication",
  "leaf.fill": "eco",
  "sun.max.fill": "wb-sunny",
  "moon.fill": "nightlight-round",
  "cloud.fill": "cloud",
  "flame.fill": "local-fire-department",
  "drop.fill": "water-drop",
} as IconMapping;

type Props = {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
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
