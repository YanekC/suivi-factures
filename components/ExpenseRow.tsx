import { storeFileInAppLocalStorage } from "@/helpers/FileHelper";
import { Expense } from "@/model/Expense";
import * as DocumentPicker from 'expo-document-picker';
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import FileCell from "./FileCell";
import { useState } from "react";

type Props = {
    expense: Expense;
    updateExpenses: (expense: Expense, expenseId: string) => void;
}

const styles = StyleSheet.create({
    itemView: {
        backgroundColor: 'lavender',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 13,
        padding: 5,
        flexWrap: "nowrap"
    }
});

export function ExpenseRow(props: Props) {
    function handleFileButtonPress() {
        DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
            .then((value) => {
                value.assets?.forEach(asset => {
                    try {
                        let createdFile = storeFileInAppLocalStorage(asset.uri, props.expense.id + '-' + asset.name)
                        props.updateExpenses(props.expense, createdFile)
                    } catch (error) {
                        Alert.alert('Le fichier existe déjà !', `Vous avez déjà téléchargé ce fichier. Erreur : ${error}`, [
                            { text: 'OK' },
                        ]);
                    }
                });
            });
    }

    return (
        <View style={styles.itemView}>
            <Text style={[styles.text, { flex: 1 }]}>{props.expense.getHumanReadableDate()}</Text>
            <Text style={[styles.text, { flex: 10 }]}>{props.expense.title}</Text>
            <Text style={[styles.text, { flex: 3, textAlign: "right" }]}>{props.expense.amount.toString()} €</Text>
            <FileCell onPress={handleFileButtonPress} expenseFiles={props.expense.attachedFiles}></FileCell>
        </View>
    );
}