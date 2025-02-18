import { Stack } from "expo-router";

export default function ImportExportStackLayout() {

    return (
        <Stack >
            <Stack.Screen name="import-export-view" options={{ headerShown: false }} />
            <Stack.Screen name="gocardless-setup" />
        </Stack>
    );
}