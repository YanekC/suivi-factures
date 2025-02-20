import { Expense } from '@/model/Expense';
import { Directory, File, Paths } from 'expo-file-system/next';


export function storeFileInAppLocalStorage(filePath: string, wantedFilePath: string): string {
    let sanitizedWantedFilePath = wantedFilePath.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
    const file = new File(filePath);
    const destination = new File(Paths.document, sanitizedWantedFilePath);
    file.copy(destination);
    return destination.uri;
}

export function deleteFileFromAppLocalStorage(filePath: string) {
    const file = new File(filePath);
    file.delete();
}

export function readExpenseCsv(filePath: string): Array<Expense> {
    const file = new File(filePath);
    const expenses: Array<Expense> = []
    let splitByLines = file.text().split(/\r?\n|\r|\n/g);
    splitByLines.forEach((value) => {
        let splittedValue = value.split(';');
        try {
            let date = parseDate(splittedValue[0]);
            let amount = parseAmount(splittedValue[2], splittedValue[3]);
            if (Number.isNaN(date.getTime())) throw "Impossible de parser la date"
            if (Number.isNaN(amount)) throw "Impossible de parser le montant"

            expenses.push(new Expense(date, splittedValue[1], amount, []));
        } catch (error) {
            console.error(`Cannot import expense line ${value}. Reason : ${error}`);
        }
    });
    return expenses;
}

function parseDate(date: string): Date {
    let splittedDate = date.split('/');
    return new Date(Number.parseInt(splittedDate[2]), Number.parseInt(splittedDate[1]) - 1, Number.parseInt(splittedDate[0]));
}

function parseAmount(debit: string, credit: string): number {
    let ret = 0.0;
    let normalizedDebit = debit.replace(',', '.') || '0'
    let normalizedCredit = credit?.replace(',', '.') || '0'

    ret += -Number.parseFloat(normalizedDebit)
    ret += Number.parseFloat(normalizedCredit)

    return ret;
}

