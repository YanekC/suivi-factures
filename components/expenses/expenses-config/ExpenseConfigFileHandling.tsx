import { ExpensesContext, updateExpenseContext, updateExpensesContext } from "@/helpers/ExpenseContext";
import Checkbox from "expo-checkbox";
import { Stack, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Button, StyleProp, StyleSheet, StyleSheetProperties, Text, TextStyle, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { deleteFileFromAppLocalStorage, storeFileInAppLocalStorage } from "@/helpers/FileHelper";
import { Expense } from "@/model/Expense";
import ExpenseFileRow from "../ExpenseFileRow";
import { updateExpense, updateExpenses } from "@/helpers/DbHelper";
import { useSQLiteContext } from "expo-sqlite";

type Props = {
    styles: StyleProp<any>;
    expenses: Expense[];
};

export default function ExpenseConfigFileHandling(props: Props) {
    const db = useSQLiteContext();
    const expensesContext = useContext(ExpensesContext);

    const [isChecked, setChecked] = useState(props.expenses.every((expense) => expense.noFile));

    function addFileToExpenses(expensesToUpdate: Expense[], fileName: string) {
        const updatedExpenses = expensesToUpdate.map(
            (expenseToUpdate) =>
                new Expense(
                    expenseToUpdate.date,
                    expenseToUpdate.title,
                    expenseToUpdate.amount,
                    expenseToUpdate.attachedFiles.concat([fileName]),
                    expenseToUpdate.noFile,
                ),
        );

        updateExpenses(db, updatedExpenses)
            .then(() => {
                updateExpensesContext(expensesContext, expensesToUpdate, updatedExpenses);
            })
            .catch((error) => Alert.alert("Impossible de mettre a jour la base de données", `Détails : ${error}`));
    }

    function setNoFileExpenses(expensesToUpdate: Expense[], noFile: boolean) {
        const updatedExpenses = expensesToUpdate.map(
            (expenseToUpdate) =>
                new Expense(
                    expenseToUpdate.date,
                    expenseToUpdate.title,
                    expenseToUpdate.amount,
                    expenseToUpdate.attachedFiles.concat(),
                    noFile,
                ),
        );

        updateExpenses(db, updatedExpenses)
            .then(() => {
                updateExpensesContext(expensesContext, expensesToUpdate, updatedExpenses);
                setChecked(noFile);
            })
            .catch((error) => Alert.alert("Impossible de mettre a jour la base de données", `Détails : ${error}`));
    }

    function handleFileButtonPress() {
        DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true }).then((value) => {
            value.assets?.forEach((asset) => {
                try {
                    let createdFile = storeFileInAppLocalStorage(asset.uri, props.expenses[0]?.id + "-" + asset.name);
                    addFileToExpenses(props.expenses, createdFile);
                } catch (error) {
                    Alert.alert("Le fichier existe déjà !", `Vous avez déjà téléchargé ce fichier. Erreur : ${error}`, [
                        { text: "OK" },
                    ]);
                }
            });
        });
    }

    return (
        <>
            <Button title="Ajouter un fichier" onPress={handleFileButtonPress}></Button>
            <Text style={props.styles.header}>Pas besoin de fichier ?</Text>
            <View style={props.styles.section}>
                <Checkbox
                    style={props.styles.checkbox}
                    value={isChecked}
                    onValueChange={(value) => setNoFileExpenses(props.expenses, value)}
                />
                <Text style={props.styles.paragraph}>Pas de fichier</Text>
            </View>
        </>
    );
}
