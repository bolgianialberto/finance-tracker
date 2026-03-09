import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const C = {
  bg: "#F4F2FB", // sfondo lavanda chiarissimo
  surface: "#FFFFFF", // card bianca
  border: "#E2DCF7", // bordo viola pallido
  inputBg: "#F9F8FE", // input quasi bianco con tinta viola
  violet: "#5548F9", // viola protagonista
  violetLight: "#EDE8FF", // viola chiarissimo per toggle inattivo
  violetMid: "#C4B5FD", // viola medio per decorazioni
  text: "#1A1535", // testo scuro con tinta viola
  muted: "#9589B8", // testo secondario viola grigio
  white: "#FFFFFF",
};

export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) Alert.alert("Errore", error.message);
  }

  async function handleRegister() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: { data: { display_name: displayName.trim() } },
    });
    setLoading(false);
    if (error)
      Alert.alert("Errore", error.message + " | code: " + error.status);
    else Alert.alert("Benvenuto!", "Account creato con successo.");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Sfere decorative chiare */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>FinTrac</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Toggle */}
          <View style={styles.toggleRow}>
            {(["login", "register"] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.toggleBtn, mode === m && styles.toggleActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.toggleText,
                    mode === m && styles.toggleTextActive,
                  ]}
                >
                  {m === "login" ? "Login" : "Register"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === "register" && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NOME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mario Rossi"
                  placeholderTextColor={C.muted}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="mario@email.com"
                placeholderTextColor={C.muted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={C.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={C.white} />
              ) : (
                <Text style={styles.submitText}>
                  {mode === "login" ? "Login" : "Register"}
                  {"  →"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {mode === "login" ? "Non hai un account? " : "Hai già un account? "}
          <Text
            style={styles.footerLink}
            onPress={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Registrati" : "Accedi"}
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  orb1: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "#DDD6FE60",
    top: -120,
    right: -100,
  },
  orb2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#EDE9FE50",
    bottom: 40,
    left: -80,
  },

  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: C.violetLight,
    borderWidth: 1.5,
    borderColor: C.violetMid,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: C.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  logoCore: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlyph: {
    fontSize: 26,
    color: C.white,
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: C.text,
    letterSpacing: -1.2,
  },
  tagline: {
    fontSize: 12,
    color: C.muted,
    marginTop: 5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  // Card
  card: {
    backgroundColor: C.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    shadowColor: "#6B4EFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    backgroundColor: C.violetLight,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 13,
  },
  toggleActive: {
    backgroundColor: C.violet,
    shadowColor: C.violet,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.muted,
  },
  toggleTextActive: {
    color: C.white,
    fontWeight: "700",
  },

  // Form
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 7,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: C.muted,
    letterSpacing: 1.4,
  },
  input: {
    backgroundColor: C.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: C.text,
    borderWidth: 1,
    borderColor: C.border,
  },
  submitBtn: {
    backgroundColor: C.violet,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 4,
    shadowColor: C.violet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  submitBtnDisabled: {
    opacity: 0.55,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 0.4,
  },

  // Footer
  footer: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 13,
    color: C.muted,
  },
  footerLink: {
    color: C.violet,
    fontWeight: "700",
  },
});
