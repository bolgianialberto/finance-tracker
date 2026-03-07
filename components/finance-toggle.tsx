import { ToggleButton } from "@/components/finance-toggle-button";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { FinanceType } from "../models/finance-type";

type Props = {
  value: FinanceType;
  onChange: (value: FinanceType) => void;
  getGeneral: boolean;
  getIncome: boolean;
  getExpenses: boolean;
};

export function FinanceToggle({
  value,
  onChange,
  getGeneral,
  getIncome,
  getExpenses,
}: Props) {
  const styles = useStyles();
  const { colors, spacing } = useTheme();

  // Costruiamo la lista ordinata dei tab visibili
  const tabs: FinanceType[] = [
    ...(getGeneral ? (["general"] as FinanceType[]) : []),
    ...(getExpenses ? (["expense"] as FinanceType[]) : []),
    ...(getIncome ? (["income"] as FinanceType[]) : []),
  ];

  const currentIndex = tabs.indexOf(value);

  // Larghezza di ogni singolo bottone (misurata al layout)
  const [buttonWidth, setButtonWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (buttonWidth === 0) return;
    Animated.spring(slideAnim, {
      toValue: currentIndex * buttonWidth,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [currentIndex, buttonWidth]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const totalWidth = e.nativeEvent.layout.width;
    setButtonWidth((totalWidth - spacing.xs * 2) / tabs.length); // 👈
  };

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      {/* Pill scorrevole */}
      {buttonWidth > 0 && (
        <Animated.View
          style={[
            styles.pill,
            {
              width: buttonWidth,
              backgroundColor: colors.toggleSelectedBg, // usa il tuo token colore
              transform: [{ translateX: slideAnim }],
            },
          ]}
        />
      )}

      {/* Bottoni trasparenti sopra la pill */}
      {tabs.map((tab) => (
        <ToggleButton
          key={tab}
          label={TAB_LABELS[tab]}
          variant={value === tab ? "selected" : "unselected"}
          onPress={() => onChange(tab)}
        />
      ))}
    </View>
  );
}

const TAB_LABELS: Record<FinanceType, string> = {
  general: "General",
  expense: "Expenses",
  income: "Income",
};

const useStyles = () => {
  const { colors, spacing } = useTheme();
  return createStyles(colors, spacing);
};

const createStyles = (colors: Colors, spacing: Spacing) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      borderRadius: spacing.m,
      padding: spacing.xs,
      backgroundColor: colors.toggleBackground,
      position: "relative", // necessario per la pill assoluta
    },
    pill: {
      position: "absolute",
      top: spacing.xs, // stesso valore del padding del container (spacing.xs)
      bottom: spacing.xs,
      borderRadius: spacing.sm,
      left: spacing.xs,
      // Ombra pill
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
  });
