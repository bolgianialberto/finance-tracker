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

export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) Alert.alert("Errore", error.message);
    // Se va a buon fine, Expo Router reindirizza automaticamente (vedi _layout.tsx)
  }

  async function handleRegister() {
    // Aggiungi questo
    console.log("Tentativo signup con:", {
      email: email.trim(),
      passwordLength: password.length,
      displayName: displayName.trim(),
    });

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(), // trim() rimuove spazi accidentali
      password: password.trim(),
      options: { data: { display_name: displayName.trim() } },
    });
    setLoading(false);

    console.log("DATA:", JSON.stringify(data, null, 2));
    console.log("ERROR:", JSON.stringify(error, null, 2));

    if (error)
      Alert.alert("Errore", error.message + " | code: " + error.status);
    else Alert.alert("OK", "Utente: " + data.user?.id);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Background decorativo */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.inner}>
        {/* Logo / Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>◈</Text>
          </View>
          <Text style={styles.appName}>Finance</Text>
          <Text style={styles.tagline}>Il tuo denaro, sotto controllo.</Text>
        </View>

        {/* Toggle Login / Register */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === "login" && styles.toggleActive]}
            onPress={() => setMode("login")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "login" && styles.toggleTextActive,
              ]}
            >
              Accedi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              mode === "register" && styles.toggleActive,
            ]}
            onPress={() => setMode("register")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "register" && styles.toggleTextActive,
              ]}
            >
              Registrati
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === "register" && (
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Mario Rossi"
                placeholderTextColor="#6b7280"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="mario@email.com"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0a0a0a" />
            ) : (
              <Text style={styles.submitText}>
                {mode === "login" ? "Entra →" : "Crea account →"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  bgCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#22c55e18",
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#6366f112",
    bottom: 60,
    left: -60,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 30,
    color: "#0a0a0a",
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f9fafb",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  toggleActive: {
    backgroundColor: "#22c55e",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  toggleTextActive: {
    color: "#0a0a0a",
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9ca3af",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#f9fafb",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  submitBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0a0a0a",
    letterSpacing: 0.3,
  },
});
