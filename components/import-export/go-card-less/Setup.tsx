import { Picker } from "@react-native-picker/picker";
import { Link, router } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Button, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { getAccountsList, getBankList, getRequisitionLink, importExpensesFromAccount, Bank, Account, validateToken } from "@/helpers/GoCardLessHelper";
import KeySetup from "@/components/import-export/go-card-less/KeySetup";
import { ExpensesContext } from "@/helpers/ExpenseContext";
import OpenURLButton from "@/components/import-export/go-card-less/OpenURLButton";
import { getSecureStoredString } from "@/helpers/SecureStoreHelper";
import { Expense } from "@/model/Expense";
import { importIntoDB } from "@/helpers/DbHelper";
import { useSQLiteContext } from "expo-sqlite";

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        backgroundColor: 'lavender',
        paddingTop: 15,
        paddingLeft: 10
    },
    input: {
        borderWidth: 1
    }
});

export default function GoCardLessSetup() {
    const db = useSQLiteContext();

    const [token, setToken] = useState('');

    const [selectedBank, setSelectedBank] = useState({} as Bank);
    const [bankItems, setBankItems] = useState([] as any[]);

    const [selectedAccount, setSelectedAccount] = useState({} as Account);
    const [accountItems, setAccountItems] = useState([] as any[]);

    const [requisitionLink, setRequisitionLink] = useState('');

    const [isLoadingExpense, setIsLoadingExpense] = useState(false);

    const expensesContext = useContext(ExpensesContext);

    const [secretId, setSecretId] = useState('');
    const [secretKey, setSecretKey] = useState('');

    useEffect(() => {
        Promise.all([
            getSecureStoredString(`secret_key`),
            getSecureStoredString(`secret_id`)
        ])
            .then(storedValue => {
                let key = storedValue[0];
                let id = storedValue[1];
                setSecretKey(key);
                setSecretId(id);
                validateToken(id, key)
                    .then((newToken) => {
                        setToken(newToken)
                        console.log("validated token : " + newToken)
                    }).catch(error => console.error(error))
            }
            ).catch(error => console.error(error))
    }, []);

    useEffect(() => {
        console.log("found-token:" + token)
        if (token !== '') {
            getBankList(token).then((bankList) => {
                setBankItems(bankList.map(bank => {
                    return <Picker.Item label={bank.name} value={bank} />
                }));
            }).catch(error => console.error(error))
        }
    }, [token]);

    function handleBankSelected(selectedBank: Bank) {
        setSelectedBank(selectedBank);
        getRequisitionLink(token, selectedBank.id).then(requisition => {
            console.log(requisition.id);
            setRequisitionLink(requisition.link);
        });
    }

    function generateAccountList() {
        getRequisitionLink(token, selectedBank.id).then(requisition => {
            console.log(requisition.id);
            setRequisitionLink(requisition.link);
            getAccountsList(token, requisition.id).then((accountList) => {
                console.log(`accountList:${accountList}`)
                setAccountItems(accountList.map((account: any) => {
                    return <Picker.Item label={account.name} value={account} />
                }));
            }).catch(error => console.error('Error while retrieving acc : ' + error))
        }).catch(error => console.error('Error while retrieving requisitionlink : ' + error))
    }

    function setExpenses() {
        setIsLoadingExpense(true)
        importExpensesFromAccount(token, selectedAccount.uuid)
            .then((expenses) => {
                updateExpense(expenses);
                router.replace('/(tabs)');
            })
            .catch(error => console.error('Cannot fecth expenses : ' + error))
            .finally(() => setIsLoadingExpense(false))
    }

    function updateExpense(newExpenses: Expense[]) {
        importIntoDB(db, newExpenses)
            .then(importedExpenses =>
                expensesContext.setExpense(expensesContext.expenses.concat(importedExpenses))
            )
    }

    return (
        <ScrollView>
            <View style={{ rowGap: 20 }}>
                <KeySetup secretId={secretId} setSecretId={setSecretId} secretKey={secretKey} setSecretKey={setSecretKey} setToken={setToken} />
                <Text style={styles.header}>Étape 2 : Choisir une banque à synchroniser</Text>
                <Picker style={styles.input} enabled={bankItems.length !== 0} selectedValue={selectedBank} onValueChange={handleBankSelected}>
                    {bankItems}
                </Picker>
                <OpenURLButton url={requisitionLink} children="Étape 3 : Autoriser l'application pour cette banque" />
                <Button title="Generer la liste de compte" onPress={generateAccountList} />
                <Text style={styles.header}>Étape 4 : Choisir un compte à synchroniser</Text>
                <Picker style={styles.input} enabled={accountItems.length !== 0} selectedValue={selectedAccount} onValueChange={setSelectedAccount}>
                    {accountItems}
                </Picker>
                <Link href="..">
                    {isLoadingExpense ? <ActivityIndicator /> : <Button title="Étape 5 : Synchroniser" onPress={setExpenses} />}
                </Link>
            </View>
        </ScrollView>
    );
}