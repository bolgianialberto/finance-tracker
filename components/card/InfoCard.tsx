import { ThemedText } from "@/components/text/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import { BaseCard } from "./BaseCard";
import { CARD_STYLES, CardVariant } from "./card.styles";

type Props = {
  title: string;
  value: number;
  caption: string;
  vertical?: boolean;
  variant?: CardVariant;
};

export function InfoCard({
  title,
  value,
  caption,
  vertical,
  variant = "default",
}: Props) {
  const styleTokens = CARD_STYLES[variant];

  const backgroundColor = useThemeColor({}, styleTokens.background);
  const textColor = useThemeColor({}, styleTokens.text);

  return (
    <BaseCard backgroundColor={backgroundColor}>
      <View
        style={[vertical ? styles.headerVertical : styles.headerHorizontal]}
      >
        <ThemedText lightColor={textColor} type="default">
          {title}
        </ThemedText>
      </View>

      <ThemedText lightColor={textColor} style={styles.value} type="title">
        ${value}
      </ThemedText>

      <ThemedText lightColor={textColor} type="caption">
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
  value: {
    marginTop: 12,
  },
});
