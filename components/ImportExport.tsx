import { Expense } from "@/model/Expense";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { readExpenseCsv } from "@/helpers/FileHelper";
import { ExpensesContext } from "@/helpers/ExpenseContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%',
        backgroundColor: 'lavender',
        rowGap: 20
    },
    header: {
        fontSize: 28,
        backgroundColor: 'lavender',
        paddingTop: 15,
        paddingLeft: 10
    }
});

export default function ImportExport() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header} >Importer</Text>
            <ImportButton />
            <GoCarLessButton />

            <Text style={styles.header}>Exporter</Text>
            <Button title="Exporter au format ??"></Button>
        </SafeAreaView>
    )
};

export function GoCarLessButton() {
    return (
        <Link href="./gocardless-setup" asChild>
            <Button title="Configurer un compte GoCardLess" />
        </Link>
    );
}

export function ImportButton() {

    const db = useSQLiteContext();
    const expensesContext = useContext(ExpensesContext);

    //TODO handle another view for validation without files
    function onFileSelectedHandler() {
        DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
            .then((value) => {
                value.assets?.forEach(asset => {
                    console.log(`choosed file : ${asset.uri}`);
                    readAndImportFile(asset.uri);
                });
            });
    }

    //TODO : Better handle errors 
    function readAndImportFile(uri: string) {
        let expensesFromCSV = readExpenseCsv(uri);
        let nextExpenses = expensesContext.expenses.concat();
        expensesFromCSV.forEach(expenseFromCsv => {
            if (nextExpenses.find(expense => expense.id === expenseFromCsv.id) === undefined) {
                nextExpenses.push(expenseFromCsv);
            }
        });
        //db.addAll(expensesFromCSV);
        console.log(nextExpenses)
        expensesContext.setExpense(nextExpenses)
    }

    return (
        <Button title="Choisir un fichier" onPress={onFileSelectedHandler}></Button>
    );
}