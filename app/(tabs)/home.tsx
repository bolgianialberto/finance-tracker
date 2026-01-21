import { BaseCard } from "@/components/card/BaseCard";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <BaseCard>
        <Text>ciao</Text>
      </BaseCard>
      <BaseCard>
        <Text>ciao</Text>
      </BaseCard>
      <BaseCard>
        <Text>ciao</Text>
      </BaseCard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
