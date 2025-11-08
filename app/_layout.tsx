import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { SQLiteProvider } from "expo-sqlite";
import { ExpensesContext } from "@/helpers/ExpenseContext";
import { Expense } from "@/model/Expense";
import 'expo-dev-client';
import { TaskContext } from "@/helpers/TaskContext";
import { BACKGROUND_FETCH_TASK } from "@/helpers/FetchGoCardLessBackground";
import * as TaskManager from 'expo-task-manager';
import { scheduleExpenseCheckReminder } from "@/helpers/Notification";

export default function RootLayout() {
  const [expenses, setExpenses] = useState(new Array<Expense>());
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    async function setup() {
      setIsRegistered(
        await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
      );
    }
    setup();
  }, []);

  return (
    <SQLiteProvider
      databaseName="expense.db"
      assetSource={{ assetId: require("../assets/default.db") }}
    >
      <ExpensesContext.Provider
        value={{ expenses: expenses, setExpense: setExpenses }}
      >
        <TaskContext.Provider
          value={{ isRegistered: isRegistered, setRegistered: setIsRegistered }}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </TaskContext.Provider>
      </ExpensesContext.Provider>
      <StatusBar style="dark" />
    </SQLiteProvider>
  );
}