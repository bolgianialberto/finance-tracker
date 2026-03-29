import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/hooks/use-theme";
import { Category } from "@/models/category";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FormCard } from "../card/FormCard";

type Props = {
  categories: Category[];
  selectedId?: string | null;
  onPress?: (category: Category) => void;
  onAdd?: () => void;
  error?: boolean;
};

export function CategoryGrid({
  categories,
  selectedId,
  onPress,
  onAdd,
  error,
}: Props) {
  const { colors } = useTheme();

  return (
    <FormCard error={error}>
      <View style={styles.grid}>
        {categories.map((item) => {
          const isSelected = selectedId === item.id;
          // Le categorie globali non sono cliccabili in modalità navigazione (settings)
          // ma rimangono selezionabili in modalità selezione (modale addTransaction)
          const isSelectable = !item.isGlobal || selectedId !== undefined;

          return (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.item,
                pressed && isSelectable && { opacity: 0.7 },
                isSelected && { backgroundColor: item.color + "18" },
              ]}
              onPress={() => isSelectable && onPress?.(item)}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: item.color },
                  isSelected && styles.iconWrapperSelected,
                ]}
              >
                <IconSymbol name={item.icon} size={18} color="#fff" />
              </View>
              <Text
                style={[
                  styles.label,
                  { color: colors.text },
                  isSelected && { color: item.color, fontWeight: "700" },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}

        {onAdd && (
          <Pressable
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
            onPress={onAdd}
          >
            <View style={[styles.iconWrapper, styles.addIconWrapper]}>
              <IconSymbol name="plus" size={18} color="#3B82F6" />
            </View>
            <Text style={[styles.label, { color: colors.addText }]}>Add</Text>
          </Pressable>
        )}
      </View>
    </FormCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  item: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapperSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addIconWrapper: {
    backgroundColor: "#EFF6FF",
  },
  label: {
    fontSize: 11,
    textAlign: "center",
  },
});
