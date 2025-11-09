import { storeFileInAppLocalStorage } from "@/helpers/FileHelper";
import { Expense } from "@/model/Expense";
import * as DocumentPicker from "expo-document-picker";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import FileCell from "./FileCell";
import { useState } from "react";
import { router } from "expo-router";

type Props = {
    expense: Expense;
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
    return (
        <View style={styles.itemView}>
            <Text style={[styles.text, { flex: 1 }]}>{props.expense.getHumanReadableDate()}</Text>
            <Text style={[styles.text, { flex: 10 }]}>{props.expense.title}</Text>
            <Text style={[styles.text, { flex: 3, textAlign: "right" }]}>{props.expense.amount.toString()} €</Text>
            <FileCell
                expenseFiles={props.expense.attachedFiles}
                expenseId={props.expense.id}
                noFileNeeded={props.expense.noFile}
            />
        </View>
    );
}
