import { ThemedText } from "@/components/ui/themed-text";
import { CategoryAmount } from "@/models/category-amount";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  data: CategoryAmount[];
  total: number;
  size?: number;
  strokeWidth?: number;
};

export function FinanceDonutChart({
  data,
  total,
  size = 200,
  strokeWidth = 20,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const gap = 6;
  const adjustedCircumference = circumference - gap * data.length;

  let currentOffset = 0;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {data.map((item, index) => {
          const percentage = item.amount / total;
          const strokeLength = adjustedCircumference * percentage;

          const dashArray = `${strokeLength} ${circumference}`;
          const dashOffset = -currentOffset;

          currentOffset += strokeLength + gap;

          return (
            <Circle
              key={item.category.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={item.category.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              fill="none"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          );
        })}
      </Svg>

      {/* Centro */}
      <View style={styles.center}>
        <ThemedText type="title">€ {total}</ThemedText>
        <ThemedText type="caption">This month</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
});
