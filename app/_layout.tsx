import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/src/lib/supabase";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? DefaultTheme : DarkTheme;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Al primo avvio controlla se c'è già una sessione salvata
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ascolta login e logout in tempo reale
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // aspetta che il check iniziale finisca

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // Non loggato e non siamo già sul login → vai al login
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      // Loggato ma siamo ancora sul login → vai all'app
      router.replace("/(tabs)/home");
    }
  }, [session, loading, segments]);

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={theme.dark ? "dark" : "light"} />
    </ThemeProvider>
  );
}
