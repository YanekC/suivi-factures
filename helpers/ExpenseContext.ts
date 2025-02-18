import { Expense } from "@/model/Expense";
import { createContext } from "react";

type ExpensesContextProps = {
    expenses: Array<Expense>
    setExpense: (expenses: Expense[]) => void
}

export const ExpensesContext = createContext({} as ExpensesContextProps);