import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import GoCardLessSetup from "@/components/import-export/go-card-less/GoCardLessSetup";
import SettingsScreen from "@/components/settings/SettingsScreen";

export default function GlobalSettingsScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Configuration de l'application" }} />
            <SettingsScreen />
        </>
    );
}
