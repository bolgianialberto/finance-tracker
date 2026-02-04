import { StyleSheet, View } from "react-native";
import { BaseCard } from "./BaseCard";

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
};

export function ChartCard({ header, children }: Props) {
  return (
    <BaseCard>
      {header && <View style={styles.header}>{header}</View>}
      <View style={styles.content}>{children}</View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  header: { width: "100%", marginBottom: 12 },
  content: {
    gap: 16,
  },
});
