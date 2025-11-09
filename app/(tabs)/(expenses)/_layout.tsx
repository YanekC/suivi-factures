import { LAST_TIME_EXPENSES_VIEWED, saveInsecure } from "@/helpers/StorageHelper";
import { Stack } from "expo-router";

export default function ExpensesLayout() {
    return (
        <Stack>
            <Stack.Screen name="[expenseId]" />
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
