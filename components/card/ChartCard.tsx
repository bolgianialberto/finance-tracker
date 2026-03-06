import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { BaseCard } from "./BaseCard";

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
};

export function ChartCard({ header, children }: Props) {
  const { spacing } = useTheme();
  return (
    <BaseCard>
      {header && (
        <View style={[styles.header, { marginBottom: spacing.m }]}>
          {header}
        </View>
      )}
      <View style={[{ gap: spacing.md }]}>{children}</View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  header: { width: "100%" },
});
