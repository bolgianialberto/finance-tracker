import { FinanceToggle } from "@/components/finance-toggle";
import { ErrorText } from "@/components/ui/error-text";
import { SectionLabel } from "@/components/ui/section-label";
import { AVAILABLE_ICONS } from "@/constants/icon-map";
import { useTheme } from "@/hooks/use-theme";
import { CategoryType } from "@/models/category";
import { FinanceType } from "@/models/finance-type";
import { insertCategory } from "@/src/queries/settings.queries";
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
import { ColorPicker } from "../ui/color-picker";
import { IconPicker } from "../ui/icon-picker";
import { IconSymbol } from "../ui/icon-symbol";

type Props = {
  onSuccess?: () => void;
};

const DEFAULT_COLOR = "#3B82F6";

export const AddCategorySheet = forwardRef<BottomSheet, Props>(
  ({ onSuccess }, ref) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const snapPoints = useMemo(() => ["90%"], []);

    const [name, setName] = useState("");
    const [iconKey, setIconKey] = useState(""); // vuoto = nessuna icona selezionata
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [type, setType] =
      useState<Exclude<FinanceType, "general">>("expense");
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function reset() {
      setName("");
      setIconKey("");
      setColor(DEFAULT_COLOR);
      setType("expense");
      setErrors({});
    }

    function handleTypeChange(newType: FinanceType) {
      if (newType === "general") return;
      setType(newType);
    }

    function validate(): boolean {
      const newErrors: Record<string, string> = {};
      if (!name.trim()) newErrors.name = "Inserisci un nome";
      if (!iconKey) newErrors.icon = "Seleziona un'icona";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit() {
      if (!validate()) return;
      setSaving(true);
      try {
        await insertCategory({
          name,
          iconKey,
          color,
          type: type as CategoryType,
        });
        reset();
        (ref as any)?.current?.close();
        onSuccess?.();
      } catch (e: any) {
        Alert.alert("Errore", e.message ?? "Impossibile salvare la categoria");
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

    const previewIcon =
      AVAILABLE_ICONS.find((i) => i.key === iconKey)?.icon ?? null;

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
              Add Category
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.settingDivider }]}
          />

          {/* Anteprima live */}
          <View style={styles.previewRow}>
            <View
              style={[
                styles.previewIcon,
                {
                  backgroundColor: previewIcon ? color : colors.settingDivider,
                },
              ]}
            >
              {previewIcon ? (
                <IconSymbol name={previewIcon} size={20} color="#fff" />
              ) : (
                <IconSymbol name="plus" size={20} color={colors.text + "60"} />
              )}
            </View>
            <Text style={[styles.previewName, { color: colors.text }]}>
              {name.trim() || "Category name"}
            </Text>
          </View>

          {/* Tipo */}
          <View style={styles.field}>
            <SectionLabel label="Type" />
            <FinanceToggle
              value={type}
              onChange={handleTypeChange}
              getGeneral={false}
              getIncome={true}
              getExpenses={true}
            />
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
              placeholder="Es. Palestra, Abbonamento..."
              placeholderTextColor={colors.text + "40"}
              maxLength={30}
            />
            <ErrorText message={errors.name} />
          </View>

          {/* Icona */}
          <View style={styles.field}>
            <SectionLabel label="Icon *" />
            <IconPicker
              selectedKey={iconKey}
              selectedColor={color}
              onChange={(key) => {
                setIconKey(key);
                setErrors((e) => ({ ...e, icon: "" }));
              }}
              error={!!errors.icon}
            />
            <ErrorText message={errors.icon} />
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
              <Text style={styles.submitText}>Add Category →</Text>
            )}
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

AddCategorySheet.displayName = "AddCategorySheet";

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
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
