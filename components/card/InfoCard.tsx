import { ThemedText } from "@/components/ui/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { CARD_STYLES, CardVariant } from "../../constants/styles/card.styles";
import { BaseCard } from "./BaseCard";

type Props = {
  title: string;
  value: number;
  caption: string;
  vertical?: boolean;
  variant?: CardVariant;
  loading?: boolean;
};

export function InfoCard({
  title,
  value,
  caption,
  vertical,
  variant = "default",
}: Props) {
  const { colors, spacing } = useTheme();
  const cardStyle = CARD_STYLES[variant];

  const backgroundColor = colors[cardStyle.background];
  const textColor = colors[cardStyle.text];

  return (
    <BaseCard backgroundColor={backgroundColor}>
      <View
        style={[vertical ? styles.headerVertical : styles.headerHorizontal]}
      >
        <ThemedText type="default" color={textColor}>
          {title}
        </ThemedText>
      </View>

      <ThemedText
        style={[{ marginTop: spacing.m }]}
        type="title"
        color={textColor}
      >
        ${value}
      </ThemedText>

      <ThemedText type="caption" color={textColor}>
        {caption}
      </ThemedText>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  headerHorizontal: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  headerVertical: {
    flexDirection: "column",
    gap: 4,
    alignItems: "flex-start",
  },
});
