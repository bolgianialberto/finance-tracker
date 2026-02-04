import { TimeToggleButton } from "@/components/time-toggle-button";
import type { ToggleVariant } from "@/components/toggle.styles";
import { ThemedText } from "@/components/ui/themed-text";
import { TimeRange } from "@/features/finance/models/time-range";
import { StyleSheet, View } from "react-native";

type Props = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
};

const OPTIONS: TimeRange[] = ["year", "month", "week", "day"];

export function TimeRangeToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((option, index) => {
        const variant: ToggleVariant =
          option === value ? "selected" : "unselected";

        return (
          <View key={option} style={styles.item}>
            <TimeToggleButton
              label={option.toUpperCase()}
              variant={variant}
              onPress={() => onChange(option)}
            />

            {index < OPTIONS.length - 1 && (
              <ThemedText style={styles.separator}>|</ThemedText>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    marginHorizontal: 8,
    opacity: 0.3,
  },
});
