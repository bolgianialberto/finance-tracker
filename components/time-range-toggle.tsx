import { TimeToggleButton } from "@/components/time-toggle-button";
import type { ToggleVariant } from "@/components/toggle.styles";
import { TimeRange } from "@/models/time-range";
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
              label={option}
              variant={variant}
              onPress={() => onChange(option)}
            />

            {index < OPTIONS.length - 1 && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: "#11181C", opacity: 0.3 },
                ]}
              />
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
    width: "100%",
    alignItems: "center",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    position: "absolute",
    right: -8,
    opacity: 0.3,
  },
  divider: {
    position: "absolute",
    right: 0,
    width: 1,
    height: 16,
    opacity: 0.25,
  },
});
