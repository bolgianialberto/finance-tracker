import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { BaseCard } from "./BaseCard";

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
};

export function ChartCard({ header, children }: Props) {
  const styles = useStyles();
  return (
    <BaseCard>
      {header && <View style={[styles.header, {}]}>{header}</View>}
      <View style={styles.content}>{children}</View>
    </BaseCard>
  );
}

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    header: { width: "100%", marginBottom: spacing.m },
    content: { gap: spacing.md },
  });
