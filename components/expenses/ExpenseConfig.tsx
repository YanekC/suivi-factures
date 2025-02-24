import { ExpensesContext } from "@/helpers/ExpenseContext";
import Checkbox from "expo-checkbox";
import { Stack, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { deleteFileFromAppLocalStorage, storeFileInAppLocalStorage } from "@/helpers/FileHelper";
import { Expense } from "@/model/Expense";
import ExpenseFileRow from "./ExpenseFileRow";
import { updateExpense } from "@/helpers/DbHelper";
import { useSQLiteContext } from "expo-sqlite";

export default function ExpenseConfig() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 10,
            paddingLeft: 5,
            paddingRight: 5,
            width: '100%',
            backgroundColor: 'lavender',
            rowGap: 10
        },
        header: {
            fontSize: 20,
            backgroundColor: 'lavender',
            paddingTop: 15
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

    const local = useLocalSearchParams();
    const db = useSQLiteContext();

    const expensesContext = useContext(ExpensesContext);
    const expense = expensesContext.expenses.find(value => value.id === local.expenseId) || new Expense(new Date(), 'Error', -1);

    const [isChecked, setChecked] = useState(expense?.noFile);

    function addFileToExpense(expenseToUpdate: Expense, fileName: string) {
        let newExpense = new Expense(expenseToUpdate.date, expenseToUpdate.title, expenseToUpdate.amount, expenseToUpdate.attachedFiles.concat([fileName]), expenseToUpdate.noFile);
        updateExpense(db, newExpense).then((result) => {
            expensesContext.setExpense(expensesContext.expenses.map(expense => {
                if (expense.id === expenseToUpdate.id) {
                    return newExpense as Expense;
                } else {
                    return expense;
                }
            }));
        }).catch(console.error);

    }

    function removeFileToExpense(expenseToUpdate: Expense, fileName: string) {
        let newFiles = expenseToUpdate.attachedFiles.filter(file => file !== fileName);
        let newExpense = new Expense(expenseToUpdate.date, expenseToUpdate.title, expenseToUpdate.amount, newFiles, expenseToUpdate.noFile);
        updateExpense(db, newExpense).then(() => {
            expensesContext.setExpense(expensesContext.expenses.map(expense => {
                if (expense.id === expenseToUpdate.id) {
                    return newExpense as Expense;
                } else {
                    return expense;
                }
            }));
        }).catch(console.error);
    }

    function setNoFileExpense(expenseToUpdate: Expense, noFile: boolean) {
        let newExpense = new Expense(expenseToUpdate.date, expenseToUpdate.title, expenseToUpdate.amount, expenseToUpdate.attachedFiles.concat(), noFile);
        updateExpense(db, newExpense).then((result) => {
            expensesContext.setExpense(expensesContext.expenses.map(expense => {
                if (expense.id === expenseToUpdate.id) {
                    return newExpense as Expense;
                } else {
                    return expense;
                }
            }));
            setChecked(noFile);
        }).catch(console.error);
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
            <Stack.Screen options={{ title: "Dépense" }} />
            <Text style={[styles.header, { fontSize: 24 }]}>{expense?.title}</Text>
            <Text style={styles.header}>Fichiers : </Text>
            {expense?.attachedFiles.map(file => <ExpenseFileRow key={file} filePath={file} deleteFile={handleDeleteFile} />)}
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