import { ExpensesContext } from "@/helpers/ExpenseContext";
import Checkbox from "expo-checkbox";
import { Stack, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { deleteFileFromAppLocalStorage, storeFileInAppLocalStorage } from "@/helpers/FileHelper";
import { Expense } from "@/model/Expense";
import ExpenseFileRow from "./ExpenseFileRow";

export default function ExpenseConfig() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            paddingLeft: 15,
            paddingRight: 15,
            width: '100%',
            backgroundColor: 'lavender',
            rowGap: 10
        },
        header: {
            fontSize: 20,
            backgroundColor: 'lavender',
            paddingTop: 15,
            paddingLeft: 10
        },
        input: {
            borderWidth: 1
        },
        section: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        paragraph: {
            fontSize: 15,
        },
        checkbox: {
            margin: 8,
        },
    });

    const glob = useGlobalSearchParams();
    const local = useLocalSearchParams();

    const expensesContext = useContext(ExpensesContext);
    const expense = expensesContext.expenses.find(value => value.id === local.expenseId) || new Expense(new Date(), 'Error', -1);

    const [isChecked, setChecked] = useState(expense?.noFile);

    console.log("Local:", local, "Global:", glob);

    function addFileToExpense(expenseToUpdate: Expense, fileName: string) {
        expensesContext.setExpense(expensesContext.expenses.map(expense => {
            if (expense.id === expenseToUpdate.id) {
                return { ...expense, attachedFiles: [...expense.attachedFiles, fileName] } as Expense;
            } else {
                return expense;
            }
        }));
    }

    function removeFileToExpense(expenseToUpdate: Expense, fileName: string) {
        expensesContext.setExpense(expensesContext.expenses.map(expense => {
            if (expense.id === expenseToUpdate.id) {
                let newFileArray = expense.attachedFiles.filter(file => file !== fileName);
                return { ...expense, attachedFiles: newFileArray } as Expense;
            } else {
                return expense;
            }
        }));
    }

    function setNoFileExpense(expenseToUpdate: Expense, noFile: boolean) {
        setChecked(noFile);
        expensesContext.setExpense(expensesContext.expenses.map(expense => {
            if (expense.id === expenseToUpdate.id) {
                return { ...expense, noFile: noFile } as Expense;
            } else {
                return expense;
            }
        }));
    }

    function handleFileButtonPress() {
        DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
            .then((value) => {
                value.assets?.forEach(asset => {
                    try {
                        let createdFile = storeFileInAppLocalStorage(asset.uri, expense?.id + '-' + asset.name)
                        addFileToExpense(expense, createdFile)
                    } catch (error) {
                        Alert.alert('Le fichier existe déjà !', `Vous avez déjà téléchargé ce fichier. Erreur : ${error}`, [
                            { text: 'OK' },
                        ]);
                    }
                });
            });
    }

    function handleDeleteFile(fileToDelete: string) {
        deleteFileFromAppLocalStorage(fileToDelete)
        removeFileToExpense(expense, fileToDelete)
    }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Dépense " + expense?.title }} />
            <Text style={styles.header}>Fichiers : </Text>
            {expense?.attachedFiles.map(file => <ExpenseFileRow filePath={file} deleteFile={handleDeleteFile} />)}
            <Button title="Ajouter un fichier" onPress={handleFileButtonPress}></Button>
            <Text style={styles.header}>Montant</Text>
            <Text>{expense?.amount} €</Text>
            <Text style={styles.header}>Pas besoin de fichier ?</Text>
            <View style={styles.section}>
                <Checkbox style={styles.checkbox} value={isChecked} onValueChange={(value) => setNoFileExpense(expense, value)} />
                <Text style={styles.paragraph}>Pas de fichier</Text>
            </View>
        </View>
    )
};