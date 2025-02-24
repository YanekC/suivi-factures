import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { SQLiteProvider } from "expo-sqlite";
import { ExpensesContext } from "@/helpers/ExpenseContext";
import { Expense } from "@/model/Expense";
import 'expo-dev-client';

export default function RootLayout() {
  const [expenses, setExpenses] = useState(new Array<Expense>())

  return (
    <SQLiteProvider databaseName="expense.db" assetSource={{ assetId: require('../assets/default.db') }}>
      <ExpensesContext.Provider value={{ expenses: expenses, setExpense: setExpenses }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ExpensesContext.Provider>
      <StatusBar style="dark" />
    </SQLiteProvider>
  );
}