import { Stack } from "expo-router";

export default function ImportExportStackLayout() {

    return (
        <Stack>
            <Stack.Screen
                name="import-export-view"
                options={{
                    title: "Home Screen"
                }}
            />
        </Stack>
    );
}