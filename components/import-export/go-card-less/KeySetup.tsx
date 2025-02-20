import { validateToken } from "@/helpers/GoCardLessHelper";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from 'expo-secure-store';

type Props = {
    setToken: (token: string) => void
    secretId: string
    setSecretId: (secretId: string) => void
    secretKey: string
    setSecretKey: (secretId: string) => void
}

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

export default function KeySetup(props: Props) {


    const [progressText, setProgressText] = useState('')

    function handleTokenValidation() {
        setProgressText("Validation du token...");
        validateToken(props.secretId, props.secretKey).then(generatedToken => {
            setProgressText("");
            props.setToken(generatedToken);
        }).catch(reason => {
            setProgressText(`Impossible de générer le token : ${reason}`);
        })
    }

    function cannotClickButton() {
        return props.secretId === '' || props.secretKey === '';
    }



    return (
        <>
            <Text style={styles.header}>Étape 1 : Token GoCardLess</Text>
            <Link href="https://actualbudget.org/docs/advanced/bank-sync/gocardless">
                <Text>Pour récupérer votre token, suiver les étapes ici : https://actualbudget.org/docs/advanced/bank-sync/gocardless</Text>
            </Link>
            <Text>Secret Id</Text>
            <TextInput style={styles.input} onChangeText={(value) => { SecureStore.setItemAsync("secret_id", value).then(() => props.setSecretId(value)) }} value={props.secretId} />
            <Text>Secret Key</Text>
            <TextInput style={styles.input} onChangeText={(value) => { SecureStore.setItemAsync("secret_key", value).then(() => props.setSecretKey(value)) }} value={props.secretKey} />
            <Button title="Validation du token" onPress={handleTokenValidation} disabled={cannotClickButton()} />
            <View style={{ flexDirection: "row" }}>
                <Text>{progressText}</Text>
                {progressText !== '' ? (<ActivityIndicator />) : (<></>)}
            </View>
        </>
    );
}