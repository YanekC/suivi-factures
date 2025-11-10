import { Expense } from "@/model/Expense";
import Checkbox from "expo-checkbox";
import { Stack } from "expo-router";
import { Button, Text, View } from "react-native";

export default function MultipleExpenseConfig() {
    let expenses: Expense[] = [];

    return (
        <View>
            <Stack.Screen options={{ title: "Dépenses" }} />
            <Text>{expenses.reduce((acc, expense) => acc + expense.title, ",")}</Text>
            <Text>Selectionner des fichiers à ajouter à ces dépenses</Text>
            <Button title="Ajouter des fichiers" onPress={handleFileButtonPress}></Button>
            <Text>Pas besoin de fichier ?</Text>
            <View>
                <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    onValueChange={(value) => setNoFileExpense(expense, value)}
                />
                <Text>Pas de fichier</Text>
            </View>
        </View>
    );
}
