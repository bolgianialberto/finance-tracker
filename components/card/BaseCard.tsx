import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet } from "react-native";
import { ThemedView } from "../ui/themed-view";

type Props = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export function BaseCard({ backgroundColor, children }: Props) {
  const defaultBg = useThemeColor({}, "baseCardBackground");

  return (
    <ThemedView
      style={[styles.card, { backgroundColor: backgroundColor ?? defaultBg }]}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
});
