import { DbExpense, dbExpenseToExpense, Expense } from '@/model/Expense';
import { Directory, File, Paths } from 'expo-file-system/next';
import { zip } from 'react-native-zip-archive';
import { SQLiteDatabase } from "expo-sqlite";
import { FileSystem } from 'react-native-file-access';
import { PermissionsAndroid } from 'react-native';


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


export async function createExportArchive(db: SQLiteDatabase): Promise<string> {
    const permissionGranted = await permissionWriteExternalStorage();
    if (permissionGranted) {
        let zippedFileName = (new Date().toISOString() + 'export_suivi_facture').replace(/[^a-z0-9]/gi, '_').toLowerCase()
        let zipFilePath = await createZipFile(db, zippedFileName)

        if (!FileSystem.exists(zipFilePath)) return "Impossible d'écrire le fichier";

        return FileSystem.cpExternal(zipFilePath, zippedFileName + '.zip', 'downloads').then(() => 'downloads/' + zippedFileName);
        // file should now be visible in the downloads folder
    } else {
        throw "Vous devez donner la permission à l'application d'écrire des fichiers."
    }
}

async function createZipFile(db: SQLiteDatabase, zippedFileName: string): Promise<string> {
    const result = await db.getAllAsync<DbExpense>('SELECT * FROM Expenses');
    let mappedResult = result.map(dbExpenseToExpense)

    const tempFolder = new Directory(Paths.cache, zippedFileName);
    const destinationFile = new File(Paths.cache, zippedFileName + '.zip');
    try {
        tempFolder.create();
        destinationFile.create();
    } catch (error) {
        console.log(error)
        console.log(typeof (error))
        throw error
    }
    let exportedCSVContent = ''
    mappedResult.forEach(expense => {
        let fileNamesToExport = ''
        expense.attachedFiles.forEach(fileName => {
            let attachedFile = new File(fileName);
            attachedFile.copy(tempFolder);
            fileNamesToExport += attachedFile.name + ';'
        });
        exportedCSVContent += expense.date.toLocaleDateString() + ';' + expense.title.replaceAll(';', '_') + ';' + expense.amount + ';' + fileNamesToExport
    })
    new File(tempFolder, '_index.csv').write(exportedCSVContent);
    return await zip(tempFolder.uri, destinationFile.uri)
}


const permissionWriteExternalStorage = async () => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
};

