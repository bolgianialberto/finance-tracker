import { useThemeColor } from "@/hooks/use-theme-color";
import { SelectedBar } from "@/models/selected-bar";
import { TimeRange } from "@/models/time-range";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import { FinanceBarModel } from "../models/finance-bar-model";
import { ThemedText } from "./ui/themed-text";

type Props = {
  data: FinanceBarModel[];
  range: TimeRange;
  height?: number;
  barWidth?: number;
  onLoadMore?: (direction: "left" | "right") => void;
  canLoadMore?: { left: boolean; right: boolean };
};

export function FinanceBarChart({
  data,
  range,
  height = 180,
  barWidth = 22,
  onLoadMore,
  canLoadMore = { left: false, right: false },
}: Props) {
  const incomeColor = useThemeColor({}, "income");
  const expenseColor = useThemeColor({}, "expense");
  const gainColor = useThemeColor({}, "gain");
  const lossColor = useThemeColor({}, "loss");
  const axisColor = useThemeColor({}, "divider");
  const [periodLabel, setPeriodLabel] = useState("");
  const [selectedBar, setSelectedBar] = useState<SelectedBar | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const previousDataLength = useRef(data.length);
  const hasTriggeredLeft = useRef(false);
  const hasTriggeredRight = useRef(false);

  const barGap = 10;
  const groupGap = 16;
  const chartHeight = height - 32;
  const zeroY = chartHeight;

  const maxValue = Math.max(
    ...data.flatMap((d) => [d.income, d.expenses, Math.abs(d.result ?? 0)]),
    1,
  );

  const scaleY = (value: number) =>
    (Math.abs(value) / maxValue) * (chartHeight - 10);

  const groupWidth = barWidth * 3 + barGap * 2 + groupGap;
  const chartWidth = data.length * groupWidth + 40;
  const LOAD_THRESHOLD = groupWidth * 3;

  useEffect(() => {
    if (!data.length) {
      setPeriodLabel("");
      return;
    }

    // Resetta lo scroll alla fine quando cambiano i dati o il range
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);

    previousDataLength.current = data.length;
    setPeriodLabel(formatPeriodLabel(data[data.length - 1].date, range));
    setSelectedBar(null);
  }, [data.length, range]); // Aggiungi range come dipendenza

  // Gestisci il caricamento progressivo (separato dal reset iniziale)
  useEffect(() => {
    // Quando vengono caricati nuovi dati a sinistra, mantieni la posizione
    if (
      data.length > previousDataLength.current &&
      scrollX < LOAD_THRESHOLD * 2
    ) {
      const addedItems = data.length - previousDataLength.current;
      const offsetAdjustment = addedItems * groupWidth;

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollX + offsetAdjustment,
          animated: false,
        });
      }, 50);

      previousDataLength.current = data.length;
    }
  }, [data.length]);

  const handleScroll = (e: any) => {
    const currentScrollX = e.nativeEvent.contentOffset.x;
    const contentWidth = e.nativeEvent.contentSize.width;
    const layoutWidth = e.nativeEvent.layoutMeasurement.width;

    setScrollX(currentScrollX);

    const centerIndex = Math.round(currentScrollX / groupWidth);
    const item = data[centerIndex];
    if (item) {
      setPeriodLabel(formatPeriodLabel(item.date, range));
    }

    // Load more a sinistra
    if (
      currentScrollX < LOAD_THRESHOLD &&
      canLoadMore.left &&
      !hasTriggeredLeft.current
    ) {
      hasTriggeredLeft.current = true;
      onLoadMore?.("left");
      setTimeout(() => {
        hasTriggeredLeft.current = false;
      }, 500);
    }

    // Load more a destra
    if (
      currentScrollX + layoutWidth > contentWidth - LOAD_THRESHOLD &&
      canLoadMore.right &&
      !hasTriggeredRight.current
    ) {
      hasTriggeredRight.current = true;
      onLoadMore?.("right");
      setTimeout(() => {
        hasTriggeredRight.current = false;
      }, 500);
    }
  };

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onTouchStart={() => setSelectedBar(null)}
      >
        <Svg width={chartWidth} height={height}>
          {data.map((item, index) => {
            const xStart = index * groupWidth + 20;

            const incomeH = scaleY(item.income);
            const expenseH = scaleY(item.expenses);
            const resultH = scaleY(item.result ?? 0);

            const hitPaddingX = 6;
            const hitPaddingY = 6;
            const expensesX = xStart + barWidth + barGap;
            const resultX = xStart + (barWidth + barGap) * 2;

            return (
              <View key={item.date.toISOString()}>
                {/* Income */}
                <Rect
                  x={xStart}
                  y={zeroY - incomeH}
                  width={barWidth}
                  height={incomeH}
                  fill={incomeColor}
                />

                {/* Expenses */}
                <Rect
                  x={expensesX}
                  y={zeroY - expenseH}
                  width={barWidth}
                  height={expenseH}
                  fill={expenseColor}
                />

                {/* Result */}
                <Rect
                  x={resultX}
                  y={zeroY - resultH}
                  width={barWidth}
                  height={resultH}
                  fill={item.result! >= 0 ? gainColor : lossColor}
                />

                {/* Income - area cliccabile */}
                <Rect
                  x={xStart - hitPaddingX}
                  y={zeroY - incomeH - hitPaddingY}
                  width={barWidth + hitPaddingX * 2}
                  height={incomeH + hitPaddingY * 2}
                  fill="#000"
                  fillOpacity={0}
                  onPress={() =>
                    setSelectedBar({
                      x: xStart + barWidth / 2,
                      y: zeroY - incomeH,
                      value: item.income,
                      kind: "income",
                    })
                  }
                />

                {/* Expenses - area cliccabile */}
                <Rect
                  x={expensesX - hitPaddingX}
                  y={zeroY - expenseH - hitPaddingY}
                  width={barWidth + hitPaddingX * 2}
                  height={expenseH + hitPaddingY * 2}
                  fill="#000"
                  fillOpacity={0}
                  onPress={() =>
                    setSelectedBar({
                      x: expensesX + barWidth / 2,
                      y: zeroY - expenseH,
                      value: item.expenses,
                      kind: "expense",
                    })
                  }
                />

                {/* Result - area cliccabile */}
                <Rect
                  x={resultX - hitPaddingX}
                  y={zeroY - resultH - hitPaddingY}
                  width={barWidth + hitPaddingX * 2}
                  height={resultH + hitPaddingY * 2}
                  fill="#000"
                  fillOpacity={0}
                  onPress={() =>
                    setSelectedBar({
                      x: resultX + barWidth / 2,
                      y: zeroY - resultH,
                      value: item.result ?? 0,
                      kind: "result",
                    })
                  }
                />

                {/* Label periodo */}
                <SvgText
                  x={xStart + (barWidth * 3 + barGap * 2) / 2}
                  y={zeroY + 14}
                  fontSize={10}
                  fill={axisColor}
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </View>
            );
          })}

          {data.map((_, index) => {
            if (index === data.length - 1) return null;

            const xStart = index * groupWidth + 20;
            const barsGroupWidth = barWidth * 3 + barGap * 2;
            const dividerX = xStart + barsGroupWidth + groupGap / 2;

            return (
              <Line
                key={`divider-${index}`}
                x1={dividerX}
                x2={dividerX}
                y1={zeroY}
                y2={zeroY - 6}
                stroke={axisColor}
                strokeWidth={1}
                strokeLinecap="round"
              />
            );
          })}

          {/* asse X */}
          <Line
            x1={0}
            x2={chartWidth}
            y1={zeroY}
            y2={zeroY}
            stroke={axisColor}
            strokeWidth={1}
          />
        </Svg>
      </ScrollView>

      {selectedBar && (
        <View
          pointerEvents="none"
          style={[
            styles.tooltip,
            {
              left: selectedBar.x - 40 - scrollX,
              top: selectedBar.y - 36,
            },
          ]}
        >
          <ThemedText style={[styles.tooltipText, { color: "#11181C" }]}>
            {selectedBar.kind === "result" && selectedBar.value > 0 ? "+" : ""}
            {selectedBar.value.toLocaleString("it-IT")} €
          </ThemedText>
        </View>
      )}

      <View style={styles.periodLabelContainer}>
        <ThemedText
          darkColor={useThemeColor({}, "barChartTextLabel")}
          style={styles.periodLabel}
        >
          {periodLabel}
        </ThemedText>
      </View>

      {/* LEGENDA */}
      <View style={styles.legend}>
        <LegendItem color={incomeColor} label="Income" />
        <LegendItem color={expenseColor} label="Expenses" />
        <LegendItem color={gainColor} label="Gain" />
        <LegendItem color={lossColor} label="Loss" />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function formatPeriodLabel(date: Date, range: TimeRange) {
  switch (range) {
    case "day":
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

    case "week":
    case "month":
      return date.getFullYear().toString();

    case "year":
      return "";
  }
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
    gap: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
  },
  periodLabelContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  periodLabel: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.6,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
