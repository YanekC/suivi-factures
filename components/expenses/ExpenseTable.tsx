import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SectionList, StatusBar, SectionListData } from 'react-native';
import { ExpenseRow } from './ExpenseRow';
import { Expense } from '@/model/Expense';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { ExpensesContext } from '@/helpers/ExpenseContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%',
        backgroundColor: 'lavender',
    },
    monthHeader: {
        fontSize: 28,
        backgroundColor: 'lavender',
        paddingTop: 15,
        paddingBottom: 5,
        paddingLeft: 10
    }
});

export function ExpenseTable() {
    const db = useSQLiteContext();
    const expensesContext = useContext(ExpensesContext);

    useEffect(() => {
        async function setup() {
            const result = await db.getAllAsync<Expense>('SELECT * FROM Expenses');
            expensesContext.setExpense(result);
        }
        setup();
    }, []);

    function transformExpensesToSections() {
        //GroupBy month
        let expensesByMonthMap = expensesContext.expenses.reduce((groups, expense) => {
            const month = expense.getMonthKey();
            if (!groups.has(month)) {
                groups.set(month, [])
            }
            groups.get(month)?.push(expense);
            return groups;
        }, new Map<number, Expense[]>())
        let expensesByMonth: Array<any> = []
        Array.from(expensesByMonthMap.keys())
            .sort((monthA, monthB) => { return monthB - monthA })
            .forEach(key => {
                let value = expensesByMonthMap.get(key) || [];
                value.sort((a, b) => b.date.getTime() - a.date.getTime())
                expensesByMonth.push({
                    month: getMonthString(key),
                    data: value
                })
            });
        return expensesByMonth;
    }
    function getMonthString(monthKey: number) {
        let date = new Date(monthKey / 100, monthKey % 100)
        let month = date.toLocaleString('fr', { month: 'long', year: 'numeric' });
        return month.charAt(0).toUpperCase() + month.slice(1);
    }



    return (
        <SectionList
            sections={transformExpensesToSections()}
            style={styles.container}
            renderItem={({ item }) => (
                <ExpenseRow expense={item} />
            )}
            renderSectionHeader={({ section: { month } }) => (
                <Text style={styles.monthHeader}>{month}</Text>
            )}
        />
    );
}