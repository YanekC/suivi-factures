import { Stack } from "expo-router";
import GoCardLessSetup from "@/components/import-export/go-card-less/GoCardLessSetup";

export default function GoCardLessSetupScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Configuration GoCardLess" }} />
            <GoCardLessSetup />
        </>
    );
}
