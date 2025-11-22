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
