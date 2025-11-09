import { validateToken } from "@/helpers/GoCardLessHelper";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";

type Props = {
    setTokenValide: (isValid: boolean) => void;
    secretId: string;
    setSecretId: (secretId: string) => void;
    secretKey: string;
    setSecretKey: (secretId: string) => void;
    setLoading: (state: boolean) => void;
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "lavender",
    },
    innerContainer: {
        rowGap: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#F5F5F5",
    },
});

export default function KeySetup(props: Props) {
    function handleTokenValidation() {
        props.setLoading(true);
        validateToken({ id: props.secretId, key: props.secretKey })
            .then((generatedToken) => {
                props.setTokenValide(true);
            })
            .catch((reason) => {
                props.setTokenValide(false);
            })
            .finally(() => props.setLoading(false));
    }

    function cannotClickButton() {
        return props.secretId === "" || props.secretKey === "";
    }

    return (
        <>
            <Text style={styles.header}>Étape 1 : Token GoCardLess</Text>
            <Link href="https://actualbudget.org/docs/advanced/bank-sync/gocardless">
                <Text>
                    Pour récupérer votre token, suivez les étapes ici :
                    https://actualbudget.org/docs/advanced/bank-sync/gocardless
                </Text>
            </Link>
            <Text>Secret Id</Text>
            <TextInput
                multiline
                style={styles.input}
                onChangeText={(value) => {
                    props.setSecretId(value);
                    SecureStore.setItemAsync("secret_id", value);
                }}
                value={props.secretId}
            />
            <Text>Secret Key</Text>
            <TextInput
                multiline
                style={[styles.input, { height: 100 }]}
                onChangeText={(value) => {
                    props.setSecretKey(value);
                    SecureStore.setItemAsync("secret_key", value);
                }}
                value={props.secretKey}
            />
            <Button title="Validation du token" onPress={handleTokenValidation} disabled={cannotClickButton()} />
        </>
    );
}
