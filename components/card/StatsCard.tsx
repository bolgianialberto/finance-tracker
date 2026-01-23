import { ThemedText } from "@/components/ui/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import type { IconSymbolName } from "../ui/icon-symbol";
import { IconSymbolWrapped } from "../ui/icon-symbol-wrapped";
import { BaseCard } from "./BaseCard";
import { CARD_STYLES, type CardVariant } from "./card.styles";

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
  const styleTokens = CARD_STYLES[variant];

  const backgroundColor = useThemeColor({}, styleTokens.background);
  const textColor = useThemeColor({}, styleTokens.text);
  const iconBg = useThemeColor({}, styleTokens.iconBg);
  const iconColor = useThemeColor({}, styleTokens.icon);

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
        <ThemedText lightColor={textColor} type="default">
          {title}
        </ThemedText>
      </View>

      <ThemedText style={styles.value} type="title">
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
