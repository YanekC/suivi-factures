import { Expense } from "@/model/Expense";
import Checkbox from "expo-checkbox";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import ExpenseConfigFileHandling from "./ExpenseConfigFileHandling";
import { useContext } from "react";
import { ExpensesContext } from "@/helpers/ExpenseContext";

export default function MultipleExpenseConfig() {
    const styles = StyleSheet.create({
        header: {
            fontSize: 20,
            backgroundColor: "lavender",
            paddingTop: 15,
        },
        section: {
            flexDirection: "row",
            alignItems: "center",
        },
        paragraph: {
            fontSize: 15,
        },
        checkbox: {
            margin: 8,
        },
    });

    const local = useLocalSearchParams();
    const expensesContext = useContext(ExpensesContext);
    const expenses = expensesContext.expenses.filter((expense) => local.expenseId.includes(expense.id));

    return (
        <View>
            <Stack.Screen options={{ title: "Dépenses" }} />
            <Text>{expenses.reduce((acc, expense) => acc + expense.title, ",")}</Text>
            <Text>Selectionner des fichiers à ajouter à ces dépenses</Text>
            <ExpenseConfigFileHandling styles={styles} expenses={expenses} />
        </View>
    );
}
