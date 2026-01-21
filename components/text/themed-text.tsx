import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { TEXT_STYLES, TextVariant } from "./text.styles";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextVariant;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <Text style={[{ color }, TEXT_STYLES[type], style]} {...rest} />;
}
