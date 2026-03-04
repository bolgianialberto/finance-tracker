import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { Category } from "@/models/category";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  categories: Category[];
  loading: boolean;
  onAddCategory?: () => void;
};

export function SettingsCategories({
  categories,
  loading,
  onAddCategory,
}: Props) {
  return (
    <View>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Categories
      </ThemedText>

      <View style={styles.card}>
        <View style={styles.grid}>
          {categories.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              <View
                style={[styles.iconWrapper, { backgroundColor: item.color }]}
              >
                <IconSymbol name={item.icon} size={18} color="#fff" />
              </View>
              <ThemedText style={styles.label}>{item.name}</ThemedText>
            </Pressable>
          ))}

          {/* Bottone aggiungi categoria */}
          <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={onAddCategory}
          >
            <View style={[styles.iconWrapper, styles.addIconWrapper]}>
              <IconSymbol name="plus" size={18} color="#3B82F6" />
            </View>
            <ThemedText style={[styles.label, styles.addLabel]}>Add</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#6B7280",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  pressed: {
    backgroundColor: "#F9FAFB",
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  addIconWrapper: {
    backgroundColor: "#EFF6FF",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
  addLabel: {
    color: "#3B82F6",
  },
});
