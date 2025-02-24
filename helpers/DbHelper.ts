import { DbExpense, dbExpenseToExpense as dbExpenseToExpense, Expense } from "@/model/Expense";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";
import { normalizeParams } from "expo-sqlite/src/paramUtils";

export async function importIntoDB(db: SQLiteDatabase, newExpenses: Expense[]): Promise<Expense[]> {
    let importedExpenses = [] as Expense[];
    let notImported = 0;
    let errorWhenImport = 0;
    newExpenses.forEach(expense => {
        let value = db.getFirstSync<DbExpense>('SELECT * FROM Expenses WHERE date = ? AND amount = ? AND title = ?', expense.date.getTime(), expense.amount, expense.title)
        if (value !== null) {
            notImported++;
        } else {
            try {
                db.runSync('INSERT INTO Expenses (date, title, amount, noFile, attachedFiles) VALUES (?, ?, ?, ?, ?)',
                    expense.date.getTime(), expense.title, expense.amount, expense.noFile, expense.attachedFiles.join());
                importedExpenses.push(expense)
            } catch (error) {
                console.log(error)
                errorWhenImport++;
            }
        }
    })
    console.log(`Imported: ${importedExpenses.length}, notImported: ${notImported}, errorWhenImport: ${errorWhenImport}`)
    return importedExpenses;
}

export async function updateExpense(db: SQLiteDatabase, newExpenses: Expense): Promise<SQLiteRunResult> {
    return db.runAsync(`
            UPDATE Expenses
            SET noFile = ?, attachedFiles = ?
            WHERE date = ? AND amount = ? AND title = ?`,
        newExpenses.noFile ? 1 : 0, newExpenses.attachedFiles.join(),
        newExpenses.date.getTime(), newExpenses.amount, newExpenses.title
    )
}

export async function getMissingFilesExpenses(db: SQLiteDatabase): Promise<Expense[]> {
    return db.getAllAsync<DbExpense>("SELECT * FROM Expenses WHERE noFile == 0 AND attachedFiles = ''")
        .then(expensesDb => expensesDb.map(expensDb => dbExpenseToExpense(expensDb)))

}