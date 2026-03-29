import { FinanceToggle } from "@/components/finance-toggle";
import { useAccountsData } from "@/hooks/use-account-data";
import { useCategoriesData } from "@/hooks/use-category-data";
import { useTheme } from "@/hooks/use-theme";
import { Account } from "@/models/account";
import { Category } from "@/models/category";
import { FinanceType } from "@/models/finance-type";
import { insertTransaction } from "@/src/queries/transactions.queries";
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
import { AccountList } from "../account/account-list";
import { CategoryGrid } from "../category/category-grid";
import { DatePicker } from "../ui/date-picker";
import { ErrorText } from "../ui/error-text";
import { SectionLabel } from "../ui/section-label";

type Props = {
  onSuccess?: () => void;
  initialType?: Exclude<FinanceType, "general">;
};

export const AddTransactionSheet = forwardRef<BottomSheet, Props>(
  ({ onSuccess, initialType = "expense" }, ref) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const snapPoints = useMemo(() => ["85%"], []);

    const { accounts, loadingAccounts } = useAccountsData();
    const { categories, loadingCategories } = useCategoriesData();

    const [type, setType] =
      useState<Exclude<FinanceType, "general">>(initialType);
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

    const filteredCategories = useMemo(
      () => categories.filter((c) => c.type === type || c.type === "general"),
      [categories, type],
    );

    function handleTypeChange(newType: FinanceType) {
      if (newType === "general") return;
      setType(newType);
      setSelectedCategoryId(null);
      setErrors({});
    }

    function handleCategorySelect(cat: Category) {
      setSelectedCategoryId(cat.id);
      setErrors((e) => ({ ...e, category: "" }));
    }

    function handleAccountSelect(acc: Account) {
      setSelectedAccountId(acc.id);
      setErrors((e) => ({ ...e, account: "" }));
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

    useEffect(() => {
      setType(initialType);
    }, [initialType]);

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
        onChange={(index) => {
          if (index >= 0) {
            setType(initialType);
          }
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
              Add Transaction
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.settingDivider }]}
          />

          {/* Toggle — riuso FinanceToggle esistente, solo expense/income */}
          <FinanceToggle
            value={type}
            onChange={handleTypeChange}
            getGeneral={false}
            getIncome={true}
            getExpenses={true}
          />

          {/* Importo */}
          <View style={styles.field}>
            <SectionLabel label="Amount *" />
            <View
              style={[
                styles.amountRow,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.amount
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
                value={amount}
                onChangeText={(v) => {
                  setAmount(v);
                  setErrors((e) => ({ ...e, amount: "" }));
                }}
              />
            </View>
            <ErrorText message={errors.amount} />
          </View>

          {/* Categorie */}
          <View style={styles.field}>
            <SectionLabel label="Category *" />
            {loadingCategories ? (
              <ActivityIndicator />
            ) : (
              <View
                style={[
                  styles.categoryRow,
                  {
                    borderColor: errors.category
                      ? "#EF4444"
                      : colors.settingDivider,
                  },
                ]}
              >
                <CategoryGrid
                  categories={filteredCategories}
                  selectedId={selectedCategoryId}
                  onPress={handleCategorySelect}
                  // niente onAdd — siamo nella modale, non nelle settings
                  error={!!errors.category}
                />
              </View>
            )}
            <ErrorText message={errors.category} />
          </View>

          {/* Account */}
          <View style={styles.field}>
            <SectionLabel label="Account *" />
            {loadingAccounts ? (
              <ActivityIndicator />
            ) : (
              <AccountList
                accounts={accounts}
                selectedId={selectedAccountId}
                onPress={handleAccountSelect}
                // niente onAdd — siamo nella modale
                error={!!errors.account}
              />
            )}
            <ErrorText message={errors.account} />
          </View>

          {/* Data */}
          <View style={styles.field}>
            <SectionLabel label="Date *" />
            <DatePicker
              value={date}
              onChange={(v) => {
                setDate(v);
                setErrors((e) => ({ ...e, date: "" }));
              }}
              error={!!errors.date}
            />
            <ErrorText message={errors.date} />
          </View>

          {/* Nota */}
          <View style={styles.field}>
            <SectionLabel label="Note" optional />
            <TextInput
              style={[
                styles.input,
                styles.noteInput,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
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
  field: {
    gap: 8,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  accountsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
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
