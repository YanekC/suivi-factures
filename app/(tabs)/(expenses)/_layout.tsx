import { Stack } from "expo-router";

export default function ExpensesLayout() {

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="expense-config" />
            <Stack.Screen name="index" />
        </Stack>
    );
}