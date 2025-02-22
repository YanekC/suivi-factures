
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import GoCardLessSetup from "@/components/import-export/go-card-less/Setup";

export default function GoCardLessSetupScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Configuration GoCardLess' }} />
            <GoCardLessSetup />
        </>
    );
}

