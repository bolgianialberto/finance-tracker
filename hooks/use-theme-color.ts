import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? "light";
  return props[theme] ?? Colors[theme][colorName];
}
