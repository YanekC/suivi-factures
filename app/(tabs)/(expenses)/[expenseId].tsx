import ExpenseConfig from "@/components/expenses/expenses-config/ExpenseConfig";
import MultipleExpenseConfig from "@/components/expenses/expenses-config/MultipleExpensesConfig";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function ExpenseConfigScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            paddingLeft: 15,
            paddingRight: 15,
            width: "100%",
            backgroundColor: "lavender",
        },
    });

    function getConfig() {
        if (passedMultipleExpenses()) {
            return <MultipleExpenseConfig />;
        } else {
            return <ExpenseConfig />;
        }
    }

    function passedMultipleExpenses() {
        return useLocalSearchParams().expenseId.includes(",");
    }
    return (
        <>
            <View style={styles.container}>{getConfig()}</View>
        </>
    );
}
