import { ThemedText } from "@/components/ui/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Category } from "@/models/category";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { CategoryGrid } from "./category-grid";

type Props = {
  categories: Category[];
  loading: boolean;
  onAddCategory?: () => void;
  onPressCategory?: (category: Category) => void;
};

export function SettingsCategories({
  categories,
  loading,
  onAddCategory,
  onPressCategory,
}: Props) {
  const styles = useStyles();

  if (loading) return <ActivityIndicator style={{ marginTop: 16 }} />;

  return (
    <View>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Categories
      </ThemedText>
      <CategoryGrid
        categories={categories}
        onPress={onPressCategory}
        onAdd={onAddCategory}
        // selectedId non passato → nessuna selezione evidenziata
      />
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
  });
