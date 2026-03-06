import { useTheme } from "@/hooks/use-theme";
import { ThemedView } from "../ui/themed-view";

type Props = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export function BaseCard({ backgroundColor, children }: Props) {
  const { colors, spacing } = useTheme();
  const defaultBg = colors.baseCardBackground;

  return (
    <ThemedView
      style={[
        {
          backgroundColor: backgroundColor ?? defaultBg,
          borderRadius: spacing.m,
          padding: spacing.ml,
          elevation: spacing.xxs,
        },
      ]}
    >
      {children}
    </ThemedView>
  );
}
