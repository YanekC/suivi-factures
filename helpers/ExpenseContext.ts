import { Expense } from "@/model/Expense";
import React, { createContext, useContext } from "react";

type ExpensesContextProps = {
    expenses: Array<Expense>;
    setExpense: (expenses: Expense[]) => void;
};

export const ExpensesContext = createContext({} as ExpensesContextProps);

export function updateExpenseContext(
    expensesContext: ExpensesContextProps,
    expenseToUpdate: Expense,
    newExpense: Expense,
) {
    expensesContext.setExpense(
        expensesContext.expenses.map((expense) => {
            if (expense.id === expenseToUpdate.id) {
                return newExpense as Expense;
            } else {
                return expense;
            }
        }),
    );
}

export function updateExpensesContext(
    expensesContext: ExpensesContextProps,
    expensesToUpdate: Expense[],
    newExpenses: Expense[],
) {
    const newExpensesMap = new Map(newExpenses.map((expense) => [expense.id, expense]));
    expensesContext.setExpense(
        expensesContext.expenses.map((expense) => {
            return newExpensesMap.get(expense.id) || expense;
        }),
    );
}
