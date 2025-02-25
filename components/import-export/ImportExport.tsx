import { useSQLiteContext } from "expo-sqlite";
import { useContext, useState } from "react";
import { Alert, Button, StyleSheet, Text } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { createExportArchive, readExpenseCsv } from "@/helpers/FileHelper";
import { ExpensesContext } from "@/helpers/ExpenseContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { importIntoDB } from "@/helpers/DbHelper";
import LoadingScreen from "../LoadingScreen";
import { registerBackgroundFetchAsync, unregisterBackgroundFetchAsync } from "@/helpers/FetchGoCardLessBackground";

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

    const [loading, setLoading] = useState(false);
    const db = useSQLiteContext();

    function handleExportButton() {
        setLoading(true)
        createExportArchive(db).then(zipPath => {
            Alert.alert("Le fichier est disponible !", `Chemin : ${zipPath}`)
        }).catch(((error) => Alert.alert("Une erreur s'est produite lors de l'export", `Détails : ${error}`)))
            .finally(() => setLoading(false))
    }

    return (
        <SafeAreaView style={styles.container}>
            <LoadingScreen loading={loading} />
            <Text style={styles.header} >Importer</Text>
            <ImportButton />
            <GoCarLessButton />

            <Text style={styles.header}>Exporter</Text>
            <Button title="Exporter" onPress={handleExportButton}></Button>

            <Button title="Activer Sync" onPress={registerBackgroundFetchAsync}></Button>
            <Button title="Désactiver Sync" onPress={unregisterBackgroundFetchAsync}></Button>
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
        importIntoDB(db, expensesFromCSV)
            .then(importedExpenses =>
                expensesContext.setExpense(expensesContext.expenses.concat(importedExpenses))
            ).catch(error => Alert.alert("Impossible d'importer les données de la base de données", `Détails : ${error}`))
    }

    return (
        <Button title="Choisir un fichier" onPress={onFileSelectedHandler}></Button>
    );
}