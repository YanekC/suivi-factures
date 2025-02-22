import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as SQLite from 'expo-sqlite';
import { displayNotifiaction } from './Notification';
import { importExpensesFromAccount } from './GoCardLessHelper';
import { getMissingFilesExpenses, importIntoDB } from './DbHelper';
import { getSecureStoredString, retrieveInsecure } from './StorageHelper';

export const BACKGROUND_FETCH_TASK = 'background-fetch-sync-gocardless';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();

    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

    let secretKey = await getSecureStoredString(`secret_key`)
    let secretId = await getSecureStoredString(`secret_id`)
    const db = await SQLite.openDatabaseAsync('expense.db');
    const selectedBank = await retrieveInsecure('selectedBank')
    const selectedAccount = await retrieveInsecure(`selectedAccount${selectedBank}`)

    await importExpensesFromAccount({ id: secretId, key: secretKey }, selectedAccount.uuid)
        .then((expenses) => {
            return importIntoDB(db, expenses)
        })
        .catch(error => console.error('Cannot fecth expenses : ' + error))

    getMissingFilesExpenses(db).then(expenses => {
        if (expenses.length !== 0) displayNotifiaction()
    })


    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
});


// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync(): Promise<void> {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 60 * 24, // 24h
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}