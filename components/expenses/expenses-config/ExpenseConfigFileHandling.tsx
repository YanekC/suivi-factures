import { ExpensesContext, updateExpenseContext } from "@/helpers/ExpenseContext";
import Checkbox from "expo-checkbox";
import { Stack, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Button, StyleProp, StyleSheet, StyleSheetProperties, Text, TextStyle, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { deleteFileFromAppLocalStorage, storeFileInAppLocalStorage } from "@/helpers/FileHelper";
import { Expense } from "@/model/Expense";
import ExpenseFileRow from "../ExpenseFileRow";
import { updateExpense } from "@/helpers/DbHelper";
import { useSQLiteContext } from "expo-sqlite";

type Props = {
    styles: StyleProp<any>;
    expense: Expense;
};

export default function ExpenseConfigFileHandling(props: Props) {
    const db = useSQLiteContext();
    const expensesContext = useContext(ExpensesContext);

    const [isChecked, setChecked] = useState(props.expense?.noFile);

    function addFileToExpense(expenseToUpdate: Expense, fileName: string) {
        let newExpense = new Expense(
            expenseToUpdate.date,
            expenseToUpdate.title,
            expenseToUpdate.amount,
            expenseToUpdate.attachedFiles.concat([fileName]),
            expenseToUpdate.noFile,
        );
        updateExpense(db, newExpense)
            .then(() => {
                updateExpenseContext(expensesContext, expenseToUpdate, newExpense);
            })
            .catch((error) => Alert.alert("Impossible de mettre a jour la base de données", `Détails : ${error}`));
    }

    function setNoFileExpense(expenseToUpdate: Expense, noFile: boolean) {
        let newExpense = new Expense(
            expenseToUpdate.date,
            expenseToUpdate.title,
            expenseToUpdate.amount,
            expenseToUpdate.attachedFiles.concat(),
            noFile,
        );
        updateExpense(db, newExpense)
            .then(() => {
                updateExpenseContext(expensesContext, expenseToUpdate, newExpense);
                setChecked(noFile);
            })
            .catch((error) => Alert.alert("Impossible de mettre a jour la base de données", `Détails : ${error}`));
    }

    function handleFileButtonPress() {
        DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true }).then((value) => {
            value.assets?.forEach((asset) => {
                try {
                    let createdFile = storeFileInAppLocalStorage(asset.uri, props.expense?.id + "-" + asset.name);
                    addFileToExpense(props.expense, createdFile);
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
                    onValueChange={(value) => setNoFileExpense(props.expense, value)}
                />
                <Text style={props.styles.paragraph}>Pas de fichier</Text>
            </View>
        </>
    );
}
