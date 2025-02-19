import { Stack } from "expo-router";

export default function ExpensesLayout() {

    return (
        <Stack >
            <Stack.Screen name="[expenseId]" />
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}