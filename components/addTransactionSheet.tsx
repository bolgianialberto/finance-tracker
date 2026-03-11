import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAccountsData } from "@/hooks/use-account-data";
import { useCategoriesData } from "@/hooks/use-category-data";
import { useTheme } from "@/hooks/use-theme";
import { FinanceType } from "@/models/finance-type";
import { insertTransaction } from "@/src/queries/transactions.queries";
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

type Props = {
  onSuccess?: () => void;
};

export const AddTransactionSheet = forwardRef<BottomSheet, Props>(
  ({ onSuccess }, ref) => {
    const insets = useSafeAreaInsets();
    const { colors, spacing } = useTheme();

    // 92% lascia un piccolo bordo in cima — si vede che è una modale
    const snapPoints = useMemo(() => ["85%"], []);

    const { accounts, loadingAccounts } = useAccountsData();
    const { categories, loadingCategories } = useCategoriesData();

    const [type, setType] =
      useState<Exclude<FinanceType, "general">>("expense");
    const [amount, setAmount] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
      null,
    );
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
      null,
    );
    const [date, setDate] = useState(
      () => new Date().toISOString().split("T")[0],
    );
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Filtra le categorie per tipo — "both" appare sempre
    const filteredCategories = useMemo(
      () => categories.filter((c) => c.type === type || c.type === "general"),
      [categories, type],
    );

    function handleTypeChange(newType: Exclude<FinanceType, "general">) {
      setType(newType);
      setSelectedCategoryId(null); // reset categoria quando cambia tipo
      setErrors({});
    }

    function validate(): boolean {
      const newErrors: Record<string, string> = {};
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
        newErrors.amount = "Inserisci un importo valido";
      if (!selectedCategoryId) newErrors.category = "Seleziona una categoria";
      if (!selectedAccountId) newErrors.account = "Seleziona un account";
      if (!date) newErrors.date = "Inserisci una data";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit() {
      if (!validate()) return;
      const selectedCategory = categories.find(
        (c) => c.id === selectedCategoryId,
      );
      setSaving(true);
      try {
        await insertTransaction({
          amount: parseFloat(amount),
          type,
          categoryId: selectedCategoryId!,
          categoryName: selectedCategory?.name ?? "Transazione",
          accountId: selectedAccountId!,
          date,
          note,
        });
        setAmount("");
        setSelectedCategoryId(null);
        setNote("");
        setDate(new Date().toISOString().split("T")[0]);
        setErrors({});
        (ref as any)?.current?.close();
        onSuccess?.();
      } catch (e: any) {
        Alert.alert(
          "Errore",
          e.message ?? "Impossibile salvare la transazione",
        );
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

    const isExpense = type === "expense";

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        topInset={insets.top + 16}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{
          backgroundColor: colors.settingDivider,
          width: 40,
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 32, gap: spacing.md },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              Add Transaction
            </Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.settingDivider }} />

          {/* Toggle Expense / Income */}
          <View
            style={[
              styles.toggleRow,
              { backgroundColor: colors.transLegendBackground },
            ]}
          >
            <Pressable
              style={[
                styles.toggleBtn,
                isExpense && { backgroundColor: "#EF4444" },
              ]}
              onPress={() => handleTypeChange("expense")}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: isExpense ? "#fff" : colors.text,
                    opacity: isExpense ? 1 : 0.4,
                  },
                ]}
              >
                Expense
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleBtn,
                !isExpense && { backgroundColor: "#22C55E" },
              ]}
              onPress={() => handleTypeChange("income")}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: !isExpense ? "#fff" : colors.text,
                    opacity: !isExpense ? 1 : 0.4,
                  },
                ]}
              >
                Income
              </Text>
            </Pressable>
          </View>

          {/* Importo */}
          <View style={{ gap: spacing.s }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Amount *
            </Text>
            <View
              style={[
                styles.amountRow,
                {
                  borderColor: errors.amount
                    ? "#EF4444"
                    : colors.settingDivider,
                  backgroundColor: colors.transLegendBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.currencySymbol,
                  { color: colors.text, opacity: 0.4 },
                ]}
              >
                €
              </Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                placeholder="0.00"
                placeholderTextColor={colors.text + "40"}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={(v) => {
                  setAmount(v);
                  setErrors((e) => ({ ...e, amount: "" }));
                }}
              />
            </View>
            {errors.amount ? (
              <Text style={styles.errorText}>{errors.amount}</Text>
            ) : null}
          </View>

          {/* Categorie */}
          <View style={{ gap: spacing.s }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Category *
            </Text>
            {loadingCategories ? (
              <ActivityIndicator />
            ) : (
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.transLegendBackground },
                ]}
              >
                <View style={styles.categoryGrid}>
                  {filteredCategories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        style={({ pressed }) => [
                          styles.categoryItem,
                          pressed && { opacity: 0.7 },
                          isSelected && { backgroundColor: cat.color + "18" },
                        ]}
                        onPress={() => {
                          setSelectedCategoryId(cat.id);
                          setErrors((e) => ({ ...e, category: "" }));
                        }}
                      >
                        <View
                          style={[
                            styles.categoryIconWrapper,
                            { backgroundColor: cat.color },
                            isSelected && styles.categoryIconSelected,
                          ]}
                        >
                          <IconSymbol name={cat.icon} size={18} color="#fff" />
                        </View>
                        <Text
                          style={[
                            styles.categoryLabel,
                            { color: colors.text },
                            isSelected && {
                              color: cat.color,
                              fontWeight: "700",
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {cat.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
            {errors.category ? (
              <Text style={styles.errorText}>{errors.category}</Text>
            ) : null}
          </View>

          {/* Account */}
          <View style={{ gap: spacing.s }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Account *
            </Text>
            {loadingAccounts ? (
              <ActivityIndicator />
            ) : (
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.transLegendBackground },
                ]}
              >
                {accounts.map((acc, index) => {
                  const isSelected = selectedAccountId === acc.id;
                  return (
                    <View key={acc.id}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.accountRow,
                          pressed && { opacity: 0.7 },
                        ]}
                        onPress={() => {
                          setSelectedAccountId(acc.id);
                          setErrors((e) => ({ ...e, account: "" }));
                        }}
                      >
                        <View
                          style={[
                            styles.accountDot,
                            { backgroundColor: acc.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.accountName,
                            { color: colors.text },
                            isSelected && { fontWeight: "700" },
                          ]}
                        >
                          {acc.name}
                        </Text>
                        {isSelected && (
                          <IconSymbol
                            name="checkmark.circle.fill"
                            size={18}
                            color="#22C55E"
                          />
                        )}
                      </Pressable>
                      {index < accounts.length - 1 && (
                        <View
                          style={[
                            styles.rowDivider,
                            {
                              backgroundColor: colors.settingDivider,
                              marginLeft: 40,
                            },
                          ]}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            )}
            {errors.account ? (
              <Text style={styles.errorText}>{errors.account}</Text>
            ) : null}
          </View>

          {/* Data */}
          <View style={{ gap: spacing.s }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Date *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.transLegendBackground,
                  borderColor: errors.date ? "#EF4444" : colors.settingDivider,
                },
              ]}
              value={date}
              onChangeText={(v) => {
                setDate(v);
                setErrors((e) => ({ ...e, date: "" }));
              }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text + "40"}
            />
            {errors.date ? (
              <Text style={styles.errorText}>{errors.date}</Text>
            ) : null}
          </View>

          {/* Nota */}
          <View style={{ gap: spacing.s }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Note{" "}
              <Text style={{ fontWeight: "400", opacity: 0.5 }}>
                (optional)
              </Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.noteInput,
                {
                  color: colors.text,
                  backgroundColor: colors.transLegendBackground,
                  borderColor: colors.settingDivider,
                },
              ]}
              value={note}
              onChangeText={setNote}
              placeholder="Lascia vuoto per usare il nome della categoria..."
              placeholderTextColor={colors.text + "40"}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Submit */}
          <Pressable
            style={[
              styles.submitBtn,
              { backgroundColor: isExpense ? "#EF4444" : "#22C55E" },
              saving && { opacity: 0.55 },
            ]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>
                Add {isExpense ? "Expense" : "Income"} →
              </Text>
            )}
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

AddTransactionSheet.displayName = "AddTransactionSheet";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
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

  // Toggle
  toggleRow: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 11,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Section title — stile uguale a SettingsAccounts/Categories
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginLeft: 4,
  },

  // Amount
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
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: "700",
  },

  // Card — stesso stile di SettingsAccounts
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },

  // Categorie — stessa griglia di SettingsCategories
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  categoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryLabel: {
    fontSize: 11,
    textAlign: "center",
  },

  // Account — stesso stile di SettingsAccounts
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  accountDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  accountName: {
    flex: 1,
    fontSize: 15,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
  },

  // Input
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: StyleSheet.hairlineWidth,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginLeft: 4,
  },

  // Submit
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
