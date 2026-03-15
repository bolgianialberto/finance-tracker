import { IconSymbol } from "@/components/ui/icon-symbol";
import { AVAILABLE_ICONS } from "@/constants/icon-map";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  selectedKey: string;
  selectedColor: string;
  onChange: (key: string) => void;
  error?: boolean;
};

/**
 * Griglia di icone selezionabili.
 * selectedColor viene usato come sfondo dell'icona selezionata.
 */
export function IconPicker({
  selectedKey,
  selectedColor,
  onChange,
  error,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background },
        error && styles.cardError,
      ]}
    >
      <View style={styles.grid}>
        {AVAILABLE_ICONS.map(({ key, icon }) => {
          const isSelected = selectedKey === key;
          return (
            <Pressable
              key={key}
              style={({ pressed }) => [
                styles.item,
                pressed && { opacity: 0.7 },
                isSelected && { backgroundColor: selectedColor + "18" },
              ]}
              onPress={() => onChange(key)}
            >
              <View
                style={[
                  styles.iconWrapper,
                  {
                    backgroundColor: isSelected
                      ? selectedColor
                      : colors.settingDivider + "80",
                  },
                  isSelected && styles.iconWrapperSelected,
                ]}
              >
                <IconSymbol
                  name={icon}
                  size={18}
                  color={isSelected ? "#fff" : colors.text}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    padding: 8,
  },
  cardError: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#EF4444",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "16.66%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrapperSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
