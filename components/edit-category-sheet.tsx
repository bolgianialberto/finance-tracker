import { FinanceToggle } from "@/components/finance-toggle";
import { ErrorText } from "@/components/ui/error-text";
import { SectionLabel } from "@/components/ui/section-label";
import { AVAILABLE_ICONS } from "@/constants/icon-map";
import { useTheme } from "@/hooks/use-theme";
import { Category, CategoryType } from "@/models/category";
import { FinanceType } from "@/models/finance-type";
import { deleteCategory, updateCategory } from "@/src/queries/settings.queries";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
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
import { IconPicker } from "./icon-picker";
import { IconSymbol } from "./ui/icon-symbol";

type Props = {
  category: Category | null;
  onSuccess?: () => void;
};

export const EditCategorySheet = forwardRef<BottomSheet, Props>(
  ({ category, onSuccess }, ref) => {
    const insets = useSafeAreaInsets();
    const { colors, spacing } = useTheme();
    const snapPoints = useMemo(() => ["90%"], []);

    const [name, setName] = useState("");
    const [iconKey, setIconKey] = useState("");
    const [color, setColor] = useState("#3B82F6");
    const [type, setType] =
      useState<Exclude<FinanceType, "general">>("expense");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
      if (category) {
        setName(category.name);
        setIconKey(category.iconKey);
        setColor(category.color);
        setType(category.type === "general" ? "expense" : category.type);
        setErrors({});
      }
    }, [category]);

    const isGlobal = category?.isGlobal ?? false;

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

    async function handleSave() {
      if (!category || !validate()) return;
      setSaving(true);
      try {
        await updateCategory({
          id: category.id,
          name,
          iconKey,
          color,
          type: type as CategoryType,
        });
        (ref as any)?.current?.close();
        onSuccess?.();
      } catch (e: any) {
        Alert.alert(
          "Errore",
          e.message ?? "Impossibile aggiornare la categoria",
        );
      } finally {
        setSaving(false);
      }
    }

    function handleDelete() {
      if (!category) return;
      Alert.alert(
        "Elimina categoria",
        `Sei sicuro di voler eliminare "${category.name}"? Le transazioni associate rimarranno ma la categoria non sarà più visibile.`,
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Elimina",
            style: "destructive",
            onPress: async () => {
              setDeleting(true);
              try {
                await deleteCategory(category.id);
                (ref as any)?.current?.close();
                onSuccess?.();
              } catch (e: any) {
                Alert.alert(
                  "Errore",
                  e.message ?? "Impossibile eliminare la categoria",
                );
              } finally {
                setDeleting(false);
              }
            },
          },
        ],
      );
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
            { paddingBottom: insets.bottom + spacing.md },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isGlobal ? "Category Info" : "Edit Category"}
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.settingDivider }]}
          />

          {/* Banner categoria globale */}
          {isGlobal && (
            <View
              style={[
                styles.globalBanner,
                { backgroundColor: colors.settingDivider },
              ]}
            >
              <IconSymbol
                name="lock.fill"
                size={14}
                color={colors.text + "80"}
              />
              <Text style={[styles.globalText, { color: colors.text + "80" }]}>
                Questa è una categoria predefinita e non può essere modificata
              </Text>
            </View>
          )}

          {/* Anteprima */}
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
                  opacity: isGlobal ? 0.5 : 1,
                },
              ]}
              value={name}
              onChangeText={(v) => {
                if (isGlobal) return;
                setName(v);
                setErrors((e) => ({ ...e, name: "" }));
              }}
              editable={!isGlobal}
              placeholder="Es. Palestra, Abbonamento..."
              placeholderTextColor={colors.text + "40"}
              maxLength={30}
            />
            <ErrorText message={errors.name} />
          </View>

          {/* Icona */}
          <View style={[styles.field, isGlobal && { opacity: 0.5 }]}>
            <SectionLabel label="Icon *" />
            <IconPicker
              selectedKey={iconKey}
              selectedColor={color}
              onChange={(key) => {
                if (isGlobal) return;
                setIconKey(key);
                setErrors((e) => ({ ...e, icon: "" }));
              }}
              error={!!errors.icon}
            />
            <ErrorText message={errors.icon} />
          </View>

          {/* Colore */}
          <View style={[styles.field, isGlobal && { opacity: 0.5 }]}>
            <SectionLabel label="Color" />
            <ColorPicker
              value={color}
              onChange={(c) => {
                if (isGlobal) return;
                setColor(c);
              }}
            />
          </View>

          {/* Salva e Delete — nascosti per categorie globali */}
          {!isGlobal && (
            <>
              <Pressable
                style={[
                  styles.submitBtn,
                  { backgroundColor: color },
                  saving && { opacity: 0.55 },
                ]}
                onPress={handleSave}
                disabled={saving || deleting}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Save Changes →</Text>
                )}
              </Pressable>

              <Pressable
                style={[styles.deleteBtn, deleting && { opacity: 0.55 }]}
                onPress={handleDelete}
                disabled={saving || deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="#EF4444" />
                ) : (
                  <Text style={styles.deleteText}>Delete Category</Text>
                )}
              </Pressable>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

EditCategorySheet.displayName = "EditCategorySheet";

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
  globalBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  globalText: {
    fontSize: 13,
    flex: 1,
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
  deleteBtn: {
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },
});
