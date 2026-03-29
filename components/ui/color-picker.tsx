import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, View } from "react-native";

const PRESET_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#14B8A6", // teal
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#A855F7", // purple
  "#EC4899", // pink
  "#F43F5E", // rose
  "#64748B", // slate
  "#0EA5E9", // sky
];

type Props = {
  value: string;
  onChange: (color: string) => void;
};

/**
 * Palette di colori predefiniti.
 * Mostra un checkmark sul colore selezionato.
 */
export function ColorPicker({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <View style={styles.grid}>
        {PRESET_COLORS.map((color) => {
          const isSelected = value === color;
          return (
            <Pressable
              key={color}
              style={({ pressed }) => [
                styles.swatch,
                { backgroundColor: color },
                isSelected && styles.swatchSelected,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => onChange(color)}
            >
              {isSelected && (
                <IconSymbol name="checkmark" size={14} color="#fff" />
              )}
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
    padding: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  swatchSelected: {
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1.15 }],
  },
});
