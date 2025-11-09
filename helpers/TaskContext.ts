import { Expense } from "@/model/Expense";
import { createContext } from "react";

type TaskContextProps = {
    isRegistered: boolean;
    setRegistered: (registered: boolean) => void;
};

export const TaskContext = createContext({} as TaskContextProps);
