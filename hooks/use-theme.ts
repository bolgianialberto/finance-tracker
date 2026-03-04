import { theme, Theme } from "@/constants/theme";

/**
 * Hook per accedere al tema unificato dell'applicazione.
 *
 * @example
 * const { colors, spacing, radius, typography, shadows, locale } = useTheme();
 *
 * <View style={{ backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md }}>
 *   <Text style={{ fontSize: typography.size.base, fontWeight: typography.weight.bold }}>
 *     Hello
 *   </Text>
 * </View>
 */
export function useTheme(): Theme {
  // In futuro qui puoi aggiungere dark mode, es:
  // const scheme = useColorScheme();
  // return scheme === "dark" ? darkTheme : theme;
  return theme;
}
