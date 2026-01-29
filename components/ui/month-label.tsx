import { ThemedText } from "@/components/ui/themed-text";

const monthLabel = new Date().toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});

export function MonthLabel() {
  return <ThemedText type="default">{monthLabel}</ThemedText>;
}
