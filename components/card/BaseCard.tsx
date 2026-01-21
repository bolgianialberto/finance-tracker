import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet } from "react-native";
import { ThemedView } from "../themed-view";

type Props = {
  children: React.ReactNode;
};

export function BaseCard({ children }: Props) {
  const backgroundColor = useThemeColor({}, "baseCardBackground");

  return (
    <ThemedView style={[styles.card, { backgroundColor }]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
});
