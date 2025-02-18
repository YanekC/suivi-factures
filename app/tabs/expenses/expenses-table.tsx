import { ExpenseTable } from "@/components/ExpenseTable";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExpensesTableLayout() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ExpenseTable />
    </SafeAreaView>
  );
}
