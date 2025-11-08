import { Picker } from "@react-native-picker/picker";
import { Link, router } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Linking, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { getAccountsList, getBankList, getRequisitionLink, importExpensesFromAccount, Bank, Account, validateToken, Requisition } from "@/helpers/GoCardLessHelper";
import KeySetup from "@/components/import-export/go-card-less/KeySetup";
import { ExpensesContext } from "@/helpers/ExpenseContext";
import OpenURLButton from "@/components/import-export/go-card-less/OpenURLButton";
import { getSecureStoredString, retrieveInsecure, saveInsecure } from "@/helpers/StorageHelper";
import { Expense } from "@/model/Expense";
import { importIntoDB } from "@/helpers/DbHelper";
import { useSQLiteContext } from "expo-sqlite";
import { registerBackgroundFetchAsync } from "@/helpers/FetchGoCardLessBackground";
import LoadingScreen from "@/components/LoadingScreen";
import { TaskContext } from "@/helpers/TaskContext";

export default function GoCardLessSetup() {
    const db = useSQLiteContext();

    const [isTokenValide, setTokenValide] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedBank, setSelectedBank] = useState<Bank | undefined>(undefined);
    const [bankItems, setBankItems] = useState([] as any[]);

    const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined);
    const [accountItems, setAccountItems] = useState([] as any[]);

    const [requisitionLink, setRequisitionLink] = useState('');

    const expensesContext = useContext(ExpensesContext);

    const [secretId, setSecretId] = useState('');
    const [secretKey, setSecretKey] = useState('');

    const taskContext = useContext(TaskContext);

    useEffect(() => {
        let setupSecuredStoredValue = async () => {
            let key = await getSecureStoredString(`secret_key`);
            let id = await getSecureStoredString(`secret_id`);
            setSecretKey(key);
            setSecretId(id);
            const selectedBank = await retrieveInsecure('selectedBank')
            const selectedAccount = await retrieveInsecure(`selectedAccount${selectedBank}`)
            if (id !== '' && key !== '') {
                validateToken({ id: id, key: key })
                    .then(() => {
                        setTokenValide(true);
                        if (selectedBank !== null) {
                            setSelectedBank(selectedBank)
                            if (selectedAccount !== null) setSelectedAccount(selectedAccount)
                        }
                    }).catch(error => console.error(error))
            }

        }
        setupSecuredStoredValue().catch(error => Alert.alert('Le fichier existe déjà !', `Vous avez déjà téléchargé ce fichier. Erreur : ${error}`));
    }, []);

    useEffect(() => {
        if (isTokenValide) {
            setLoading(true)
            getBankList({ id: secretId, key: secretKey }).then((bankList) => {
                setBankItems(bankList.map(bank => {
                    return <Picker.Item key={bank.name} label={bank.name} value={bank} />
                }));
            }).catch(error => console.error(error))
                .finally(() => setLoading(false))
        }
    }, [isTokenValide]);

    function handleBankSelected(selectedBank: Bank) {
        setLoading(true)
        setSelectedBank(selectedBank);
        getRequisitionLink({ id: secretId, key: secretKey }, selectedBank.id).then(requisition => {
            console.log('got requisition id' + requisition.id);
            setRequisitionLink(requisition.link);
        }).catch(error => console.error('Error while retrieving requisitionlink : ' + error))
            .finally(() => setLoading(false));
    }

    function generateAccountList() {
        if (selectedBank) {
            saveInsecure(`selectedBank`, selectedBank)
            setLoading(true)
            getRequisitionLink({ id: secretId, key: secretKey }, selectedBank.id).then(requisition => {
                console.log(requisition.id);
                setRequisitionLink(requisition.link);
                return getAccountsList({ id: secretId, key: secretKey }, requisition.id).then((accountList) => {
                    setAccountItems(accountList.map((account: any) => {
                        return <Picker.Item key={account.name} label={account.name} value={account} />
                    }));
                })
            }).catch(error => console.error('Error while retrieving requisitionlink : ' + error))
                .finally(() => setLoading(false));
        } else {
            Alert.alert("Veuillez selectionner une banque");
        }
    }

    function setExpenses() {
        if (selectedAccount) {
            setLoading(true)
            importExpensesFromAccount({ id: secretId, key: secretKey }, selectedAccount.uuid)
                .then((expenses) => {
                    return importIntoDB(db, expenses)
                }).then((expenses) => {
                    expensesContext.setExpense(expensesContext.expenses.concat(expenses))
                    router.replace('/(tabs)');
                    registerBackgroundFetchAsync()
                        .then(() => taskContext.setRegistered(true))
                        .catch(error => Alert.alert("Impossible de créer la tache d'arrère plan", `Détails : ${error}`))
                })
                .catch(error => console.error('Cannot fecth expenses : ' + error))
                .finally(() => setLoading(false))
        } else {
            Alert.alert("Veuillez selectionner un compte");
        }
    }

    function saveSelectedAccount(value: Account) {
        setSelectedAccount(value)
        saveInsecure(`selectedAccount${selectedBank}`, value)
    }

    return (
        <>
            <LoadingScreen loading={loading} />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.innerContainer}>
                    <KeySetup
                        secretId={secretId}
                        setSecretId={setSecretId}
                        secretKey={secretKey}
                        setSecretKey={setSecretKey}
                        setTokenValide={setTokenValide}
                        setLoading={setLoading}
                    />
                    <Text style={styles.header}>Étape 2 : Choisir une banque à synchroniser</Text>
                    <Picker
                        style={styles.input}
                        itemStyle={styles.input}
                        enabled={bankItems.length !== 0}
                        selectedValue={selectedBank}
                        onValueChange={handleBankSelected}
                    >
                        {bankItems}
                    </Picker>
                    <OpenURLButton disabled={requisitionLink === ''} url={requisitionLink}>Étape 3 : Autoriser l'application pour cette banque</OpenURLButton>
                    <Button title="Generer la liste de compte" onPress={generateAccountList} />

                    <Text style={styles.header}>Étape 4 : Choisir un compte à synchroniser</Text>
                    <Picker
                        style={styles.input}
                        itemStyle={styles.input}
                        enabled={accountItems.length !== 0}
                        selectedValue={selectedAccount}
                        onValueChange={saveSelectedAccount}
                    >
                        {accountItems}
                    </Picker>

                    <Link href="..">
                        <Button disabled={selectedAccount === undefined} title="Étape 5 : Synchroniser" onPress={setExpenses} />
                    </Link>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'lavender',
    },
    innerContainer: {
        rowGap: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#F5F5F5',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
});