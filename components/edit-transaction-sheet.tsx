import { FinanceToggle } from "@/components/finance-toggle";
import { AccountList } from "@/components/ui/account-list";
import { CategoryGrid } from "@/components/ui/category-grid";
import { DatePicker } from "@/components/ui/date-picker";
import { ErrorText } from "@/components/ui/error-text";
import { SectionLabel } from "@/components/ui/section-label";
import { useAccountsData } from "@/hooks/use-account-data";
import { useCategoriesData } from "@/hooks/use-category-data";
import { useTheme } from "@/hooks/use-theme";
import { Account } from "@/models/account";
import { Category } from "@/models/category";
import { FinanceType } from "@/models/finance-type";
import { Transaction } from "@/models/transaction";
import {
    deleteTransaction,
    updateTransaction,
} from "@/src/queries/transactions.queries";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
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
  transaction: Transaction | null;
  onSuccess?: () => void;
};

export const EditTransactionSheet = forwardRef<BottomSheet, Props>(
  ({ transaction, onSuccess }, ref) => {
    const insets = useSafeAreaInsets();
    const { colors, spacing } = useTheme();
    const snapPoints = useMemo(() => ["85%"], []);

    const { accounts, loadingAccounts } = useAccountsData();
    const { categories, loadingCategories } = useCategoriesData();

    const [type, setType] = useState<Exclude<FinanceType, "general">>(
      () =>
        (transaction?.type === "general"
          ? "expense"
          : (transaction?.type ?? "expense")) as Exclude<
          FinanceType,
          "general"
        >,
    );
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
    const [deleting, setDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const transactionRef = useRef(transaction);
    useEffect(() => {
      transactionRef.current = transaction;
    }, [transaction]);

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

    async function handleSave() {
      if (!transaction || !validate()) return;
      setSaving(true);
      try {
        await updateTransaction({
          id: transaction.id,
          amount: parseFloat(amount),
          type,
          categoryId: selectedCategoryId!,
          accountId: selectedAccountId!,
          date,
          note: note || undefined,
        });
        (ref as any)?.current?.close();
        onSuccess?.();
      } catch (e: any) {
        Alert.alert(
          "Errore",
          e.message ?? "Impossibile aggiornare la transazione",
        );
      } finally {
        setSaving(false);
      }
    }

    function handleDelete() {
      if (!transaction) return;
      Alert.alert(
        "Elimina transazione",
        "Sei sicuro di voler eliminare questa transazione? L'operazione non è reversibile.",
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Elimina",
            style: "destructive",
            onPress: async () => {
              setDeleting(true);
              try {
                await deleteTransaction(transaction.id);
                (ref as any)?.current?.close();
                onSuccess?.();
              } catch (e: any) {
                Alert.alert(
                  "Errore",
                  e.message ?? "Impossibile eliminare la transazione",
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

    const isExpense = type === "expense";

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
          const tx = transactionRef.current;
          if (index >= 0 && tx) {
            setType(
              tx.type === "general"
                ? "expense"
                : (tx.type as Exclude<FinanceType, "general">),
            );
            setAmount(tx.amount.toString());
            setSelectedCategoryId(tx.categoryId);
            setSelectedAccountId(tx.accountId);
            setDate(tx.date);
            setNote(tx.note ?? "");
            setErrors({});
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
              Edit Transaction
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.settingDivider }]}
          />

          {/* Toggle */}
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
              <CategoryGrid
                categories={filteredCategories}
                selectedId={selectedCategoryId}
                onPress={handleCategorySelect}
                error={!!errors.category}
              />
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
              placeholder="Nota sulla transazione..."
              placeholderTextColor={colors.text + "40"}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Salva */}
          <Pressable
            style={[
              styles.submitBtn,
              { backgroundColor: isExpense ? "#EF4444" : "#22C55E" },
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
              <Text style={styles.deleteText}>Delete Transaction</Text>
            )}
          </Pressable>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

EditTransactionSheet.displayName = "EditTransactionSheet";

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
