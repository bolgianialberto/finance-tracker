import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
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
  const styles = useStyles();
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

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    sectionTitle: {
      color: colors.text,
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: spacing.m,
      padding: spacing.m,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    item: {
      width: "25%",
      alignItems: "center",
      paddingVertical: spacing.m,
      borderRadius: spacing.sm,
    },
    pressed: {
      backgroundColor: colors.pressedSettingsButton,
    },
    iconWrapper: {
      alignItems: "center",
      justifyContent: "center",

      padding: spacing.m,
      borderRadius: spacing.m,
      elevation: spacing.xxs,
      shadowRadius: spacing.xs,

      // iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
    },
    addIconWrapper: {
      backgroundColor: "#EFF6FF",
    },
    label: {
      fontSize: 12,
      textAlign: "center",
    },
    addLabel: {
      color: colors.addText,
    },
  });
