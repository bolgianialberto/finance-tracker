import { ErrorText } from "@/components/ui/error-text";
import { SectionLabel } from "@/components/ui/section-label";
import { useTheme } from "@/hooks/use-theme";
import { insertAccount } from "@/src/queries/settings.queries";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ColorPicker } from "./color-picker";

type Props = {
  onSuccess?: () => void;
};

const DEFAULT_COLOR = "#3B82F6";

export const AddAccountSheet = forwardRef<BottomSheet, Props>(
  ({ onSuccess }, ref) => {
    const insets = useSafeAreaInsets();
    const { colors, spacing } = useTheme();
    const snapPoints = useMemo(() => ["75%"], []);

    const [name, setName] = useState("");
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [initialBalance, setInitialBalance] = useState("");
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function reset() {
      setName("");
      setColor(DEFAULT_COLOR);
      setInitialBalance("");
      setErrors({});
    }

    function validate(): boolean {
      const newErrors: Record<string, string> = {};
      if (!name.trim()) newErrors.name = "Inserisci un nome";
      if (
        initialBalance !== "" &&
        (isNaN(parseFloat(initialBalance)) || parseFloat(initialBalance) < 0)
      )
        newErrors.initialBalance = "Inserisci un saldo valido";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit() {
      if (!validate()) return;
      setSaving(true);
      try {
        await insertAccount({
          name,
          color,
          initialBalance:
            initialBalance === "" ? 0 : parseFloat(initialBalance),
        });
        reset();
        (ref as any)?.current?.close();
        onSuccess?.();
      } catch (e: any) {
        Alert.alert("Errore", e.message ?? "Impossibile salvare l'account");
      } finally {
        setSaving(false);
      }
    }

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        topInset={insets.top + 16}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.addTransactionBackground }}
        handleIndicatorStyle={{
          backgroundColor: colors.settingDivider,
          width: 40,
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              Add Account
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.settingDivider }]}
          />

          {/* Anteprima */}
          <View style={styles.previewRow}>
            <View style={[styles.previewDot, { backgroundColor: color }]} />
            <Text style={[styles.previewName, { color: colors.text }]}>
              {name.trim() || "Account name"}
            </Text>
          </View>

          {/* Nome */}
          <View style={styles.field}>
            <SectionLabel label="Name *" />
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                  borderColor: errors.name ? "#EF4444" : colors.settingDivider,
                },
              ]}
              value={name}
              onChangeText={(v) => {
                setName(v);
                setErrors((e) => ({ ...e, name: "" }));
              }}
              placeholder="Es. Conto corrente, Carta..."
              placeholderTextColor={colors.text + "40"}
              maxLength={30}
            />
            <ErrorText message={errors.name} />
          </View>

          {/* Saldo iniziale */}
          <View style={styles.field}>
            <SectionLabel label="Initial balance" optional />
            <View
              style={[
                styles.amountRow,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.initialBalance
                    ? "#EF4444"
                    : colors.settingDivider,
                },
              ]}
            >
              <Text style={[styles.currencySymbol, { color: colors.text }]}>
                €
              </Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                placeholder="0.00"
                placeholderTextColor={colors.text + "40"}
                keyboardType="decimal-pad"
                value={initialBalance}
                onChangeText={(v) => {
                  setInitialBalance(v);
                  setErrors((e) => ({ ...e, initialBalance: "" }));
                }}
              />
            </View>
            <ErrorText message={errors.initialBalance} />
          </View>

          {/* Colore */}
          <View style={styles.field}>
            <SectionLabel label="Color" />
            <ColorPicker value={color} onChange={setColor} />
          </View>

          {/* Submit */}
          <Pressable
            style={[
              styles.submitBtn,
              { backgroundColor: color },
              saving && { opacity: 0.55 },
            ]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Add Account →</Text>
            )}
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

AddAccountSheet.displayName = "AddAccountSheet";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 20,
  },
  headerRow: {
    alignItems: "center",
    paddingVertical: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
  },
  // Anteprima live dell'account
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  previewDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  previewName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  field: {
    gap: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: StyleSheet.hairlineWidth,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "700",
    marginRight: 8,
    opacity: 0.4,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: "700",
  },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
});
