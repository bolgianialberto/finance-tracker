import { ErrorText } from "@/components/ui/error-text";
import { SectionLabel } from "@/components/ui/section-label";
import { useTheme } from "@/hooks/use-theme";
import { Account } from "@/models/account";
import { deleteAccount, updateAccount } from "@/src/queries/settings.queries";
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
import { ColorPicker } from "../ui/color-picker";

type Props = {
  account: Account | null;
  onSuccess?: () => void;
};

export const EditAccountSheet = forwardRef<BottomSheet, Props>(
  ({ account, onSuccess }, ref) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const snapPoints = useMemo(() => ["70%"], []);

    const [name, setName] = useState("");
    const [color, setColor] = useState("#3B82F6");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Precompila i campi quando cambia l'account selezionato
    useEffect(() => {
      if (account) {
        setName(account.name);
        setColor(account.color);
        setErrors({});
      }
    }, [account]);

    function validate(): boolean {
      const newErrors: Record<string, string> = {};
      if (!name.trim()) newErrors.name = "Inserisci un nome";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    async function handleSave() {
      if (!account || !validate()) return;
      setSaving(true);
      try {
        await updateAccount({ id: account.id, name, color });
        (ref as any)?.current?.close();
        onSuccess?.();
      } catch (e: any) {
        Alert.alert("Errore", e.message ?? "Impossibile aggiornare l'account");
      } finally {
        setSaving(false);
      }
    }

    function handleDelete() {
      if (!account) return;
      Alert.alert(
        "Elimina account",
        `Sei sicuro di voler eliminare "${account.name}"? Le transazioni associate rimarranno ma l'account non sarà più visibile.`,
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Elimina",
            style: "destructive",
            onPress: async () => {
              setDeleting(true);
              try {
                await deleteAccount(account.id);
                (ref as any)?.current?.close();
                onSuccess?.();
              } catch (e: any) {
                Alert.alert(
                  "Errore",
                  e.message ?? "Impossibile eliminare l'account",
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
              Edit Account
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

          {/* Colore */}
          <View style={styles.field}>
            <SectionLabel label="Color" />
            <ColorPicker value={color} onChange={setColor} />
          </View>

          {/* Salva */}
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

          {/* Delete */}
          <Pressable
            style={[styles.deleteBtn, deleting && { opacity: 0.55 }]}
            onPress={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <Text style={styles.deleteText}>Delete Account</Text>
            )}
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

EditAccountSheet.displayName = "EditAccountSheet";

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
    paddingTop: 14,
    alignItems: "center",
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },
});
