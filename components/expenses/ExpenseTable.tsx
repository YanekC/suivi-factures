import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, SectionList, Button } from "react-native";
import { ExpenseRow } from "./ExpenseRow";
import { DbExpense, dbExpenseToExpense as dbExpenseToExpense, Expense } from "@/model/Expense";
import { useSQLiteContext } from "expo-sqlite";
import { ExpensesContext } from "@/helpers/ExpenseContext";
import { FontAwesome } from "@expo/vector-icons";
import { TaskContext } from "@/helpers/TaskContext";
import { Link } from "expo-router";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        alignSelf: "stretch",
        backgroundColor: "lavender",
    },
    monthHeader: {
        fontSize: 28,
        backgroundColor: "lavender",
        paddingTop: 15,
        paddingBottom: 5,
        paddingLeft: 10,
    },
});

export function ExpenseTable() {
    const db = useSQLiteContext();
    const expensesContext = useContext(ExpensesContext);
    const taskContext = useContext(TaskContext);

    const [multipleSelectMode, setMultipleSelectMode] = useState(false);
    const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function setup() {
            const result = await db.getAllAsync<DbExpense>("SELECT * FROM Expenses");
            let mappedResult = result.map(dbExpenseToExpense);
            expensesContext.setExpense(mappedResult);
        }
        setup().catch((error) => console.error(error));
    }, []);

    function transformExpensesToSections() {
        //GroupBy month
        let expensesByMonthMap = expensesContext.expenses.reduce((groups, expense) => {
            const month = expense.getMonthKey();
            if (!groups.has(month)) {
                groups.set(month, []);
            }
            groups.get(month)?.push(expense);
            return groups;
        }, new Map<number, Expense[]>());
        let expensesByMonth: Array<any> = [];
        Array.from(expensesByMonthMap.keys())
            .sort((monthA, monthB) => {
                return monthB - monthA;
            })
            .forEach((key) => {
                let value = expensesByMonthMap.get(key) || [];
                value.sort((a, b) => b.date.getTime() - a.date.getTime());
                expensesByMonth.push({
                    month: getMonthString(key),
                    data: value,
                });
            });
        return expensesByMonth;
    }

    function getMonthString(monthKey: number) {
        let date = new Date(monthKey / 100, monthKey % 100);
        let month = date.toLocaleString("fr", { month: "long", year: "numeric" });
        return month.charAt(0).toUpperCase() + month.slice(1);
    }

    function getRegistrationStatus() {
        if (taskContext.isRegistered) {
            return (
                <View style={{ flexDirection: "row" }}>
                    <Text>La synchronisation en arrière plan est activée </Text>
                    <FontAwesome name="dot-circle-o" size={18} color="#00cc00" />
                </View>
            );
        } else {
            return (
                <View style={{ flexDirection: "row" }}>
                    <Text>La synchronisation en arrière plan est désactivée </Text>
                    <FontAwesome name="dot-circle-o" size={18} color="#D84040" />
                </View>
            );
        }
    }

    function resetMultipleSelection() {
        setSelectedExpenses(new Set());
        setMultipleSelectMode(false);
    }

    return (
        <>
            {getRegistrationStatus()}
            <Button title="Annuler la sélection" onPress={resetMultipleSelection} />
            <Link
                href={{
                    pathname: "/(tabs)/(expenses)/multiple-expenses",
                    params: { expenseId: Array.from(selectedExpenses) },
                }}
                asChild
            >
                <Button title="Ajouter des fichiers" />
            </Link>
            <SectionList
                sections={transformExpensesToSections()}
                style={styles.container}
                renderItem={({ item }) => (
                    <ExpenseRow
                        key={item.id}
                        expense={item}
                        multipleSelectMode={multipleSelectMode}
                        setMultipleSelectMode={setMultipleSelectMode}
                        selectedExpenses={selectedExpenses}
                        setSelectedExpenses={setSelectedExpenses}
                    />
                )}
                renderSectionHeader={({ section: { month } }) => <Text style={styles.monthHeader}>{month}</Text>}
            />
        </>
    );
}
