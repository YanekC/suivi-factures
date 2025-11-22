import { Expense } from "@/model/Expense";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import FileCell from "./FileCell";
import { useEffect, useState } from "react";

type Props = {
    expense: Expense;
    multipleSelectMode: boolean;
    setMultipleSelectMode: (mode: boolean) => void;
    selectedExpenses: Set<string>;
    setSelectedExpenses: (expenses: Set<string>) => void;
};

const styles = StyleSheet.create({
    itemView: {
        backgroundColor: "lavender",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        fontSize: 13,
        padding: 5,
        flexWrap: "nowrap",
    },
});

export function ExpenseRow(props: Props) {
    function isExpenseSelected(): boolean {
        return props.selectedExpenses.has(props.expense.id);
    }

    function setSelected(value: boolean) {
        if (value) {
            props.setSelectedExpenses(new Set(props.selectedExpenses).add(props.expense.id));
        } else {
            //Remove expense from selected expenses
            let newSet = new Set(props.selectedExpenses);
            newSet.delete(props.expense.id);
            props.setSelectedExpenses(newSet);
        }
    }

    function getBackgroundColor() {
        if (props.multipleSelectMode) {
            return isExpenseSelected() ? "#C7B8E8" : "lavender";
        } else {
            return "lavender";
        }
    }

    function handleLongPress() {
        props.setMultipleSelectMode(true);
        setSelected(true);
    }

    function handlePress() {
        if (props.multipleSelectMode) {
            setSelected(!isExpenseSelected());
        }
    }

    return (
        <Pressable
            style={[styles.itemView, { backgroundColor: getBackgroundColor() }]}
            onLongPress={handleLongPress}
            onPress={handlePress}
        >
            <Text style={[styles.text, { flex: 1 }]}>{props.expense.getHumanReadableDate()}</Text>
            <Text style={[styles.text, { flex: 10 }]}>{props.expense.title}</Text>
            <Text style={[styles.text, { flex: 3, textAlign: "right" }]}>{props.expense.amount.toString()} €</Text>
            <FileCell
                expenseFiles={props.expense.attachedFiles}
                expenseId={props.expense.id}
                noFileNeeded={props.expense.noFile}
            />
        </Pressable>
    );
}
