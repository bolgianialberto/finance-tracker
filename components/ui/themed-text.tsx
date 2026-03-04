import { useTheme } from "@/hooks/use-theme";
import { Text, type TextProps } from "react-native";
import { TEXT_STYLES, TextVariant } from "../../variant/text.styles";

export type ThemedTextProps = TextProps & {
  color?: string;
  type?: TextVariant;
};

export function ThemedText({
  style,
  color,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[{ color: color ?? colors.text }, TEXT_STYLES[type], style]}
      {...rest}
    />
  );
}
