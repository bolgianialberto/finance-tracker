import { StyleSheet, Text } from "react-native";

type Props = {
  message?: string;
};

/**
 * Testo di errore per i form.
 * Non renderizza nulla se message è undefined o vuoto.
 */
export function ErrorText({ message }: Props) {
  if (!message) return null;

  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: "#EF4444",
    fontSize: 12,
    marginLeft: 4,
    marginTop: -4,
  },
});
