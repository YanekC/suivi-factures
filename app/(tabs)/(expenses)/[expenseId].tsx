import ExpenseConfig from "@/components/expenses/ExpenseConfig";
import MultipleExpenseConfig from "@/components/expenses/MultipleExpensesConfig";
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
        if (useLocalSearchParams().expenseId.includes(",")) {
            return <MultipleExpenseConfig />;
        } else {
            return <ExpenseConfig />;
        }
    }
    return (
        <>
            <View style={styles.container}>{getConfig()}</View>
        </>
    );
}
