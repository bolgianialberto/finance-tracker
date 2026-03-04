import { ThemedText } from "@/components/ui/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { CARD_STYLES, type CardVariant } from "../../variant/card.styles";
import type { IconSymbolName } from "../ui/icon-symbol";
import { IconSymbolWrapped } from "../ui/icon-symbol-wrapped";
import { BaseCard } from "./BaseCard";

type Props = {
  title: string;
  value: number;
  icon: IconSymbolName;
  variant?: CardVariant;
  vertical?: boolean;
};

export function StatsCard({
  title,
  value,
  icon,
  variant = "default",
  vertical,
}: Props) {
  const { colors } = useTheme();
  const cardStyle = CARD_STYLES[variant];

  const backgroundColor = colors[cardStyle.background];
  const textColor = colors[cardStyle.text];
  const iconBg = colors[cardStyle.iconBg];
  const iconColor = colors[cardStyle.icon];

  return (
    <BaseCard backgroundColor={backgroundColor}>
      <View
        style={[vertical ? styles.headerVertical : styles.headerHorizontal]}
      >
        <IconSymbolWrapped
          size={28}
          name={icon}
          backgroundColor={iconBg}
          iconColor={iconColor}
        />
        <ThemedText type="default" color={textColor}>
          {title}
        </ThemedText>
      </View>

      <ThemedText style={styles.value} type="title" color={textColor}>
        ${value}
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
