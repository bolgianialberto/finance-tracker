import { useTheme } from "@/hooks/use-theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  error?: boolean;
};

const toDateString = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = () => new Date();
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

const formatDisplay = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

type ChipId = "today" | "yesterday" | "custom";

/**
 * Selettore data con chip: Oggi, Ieri, Scegli.
 * Usato in AddTransactionSheet.
 */
export function DatePicker({ value, onChange, error }: Props) {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const todayStr = toDateString(today());
  const yesterdayStr = toDateString(yesterday());

  const activeChip: ChipId =
    value === todayStr
      ? "today"
      : value === yesterdayStr
        ? "yesterday"
        : "custom";

  function handleChip(chip: ChipId) {
    if (chip === "today") {
      onChange(todayStr);
      setShowPicker(false);
    } else if (chip === "yesterday") {
      onChange(yesterdayStr);
      setShowPicker(false);
    } else {
      setShowPicker(true);
    }
  }

  function handlePickerChange(_: any, selected?: Date) {
    if (Platform.OS === "android") setShowPicker(false);
    if (selected) onChange(toDateString(selected));
  }

  const pickerDate = (() => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  })();

  const chips: { id: ChipId; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    {
      id: "custom",
      label: activeChip === "custom" ? formatDisplay(value) : "Choose...",
    },
  ];

  return (
    <View>
      {/* Chip row */}
      <View style={styles.row}>
        {chips.map((chip) => {
          const isActive = activeChip === chip.id;
          return (
            <Pressable
              key={chip.id}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.background,
                  borderColor:
                    error && !isActive
                      ? "#EF4444"
                      : isActive
                        ? colors.primary
                        : colors.settingDivider,
                },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => handleChip(chip.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isActive ? "#fff" : colors.text },
                ]}
                numberOfLines={1}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* iOS: picker inline dentro modale */}
      {Platform.OS === "ios" && showPicker && (
        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setShowPicker(false)}
          >
            <View
              style={[
                styles.pickerCard,
                { backgroundColor: colors.background },
              ]}
            >
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="inline"
                maximumDate={today()}
                onChange={handlePickerChange}
                locale="it-IT"
              />
              <Pressable
                style={[styles.doneBtn, { backgroundColor: colors.primary }]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.doneBtnText}>Conferma</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Android: picker nativo diretto */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          maximumDate={today()}
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  // iOS modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  pickerCard: {
    borderRadius: 16,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  doneBtn: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
