export class Expense {
    date: Date;
    title: string;
    amount: number;
    attachedFiles: Array<string>;
    id: string;
    //True when you dont need to attach any file
    noFile: boolean;

    constructor(date: Date, title: string, amount: number, attachedFiles?: Array<string>, noFile?: boolean) {
        this.date = date;
        this.title = title;
        this.amount = amount;
        this.attachedFiles = new Array();
        if (attachedFiles) {
            this.attachedFiles.concat(attachedFiles);
        }
        if (noFile) {
            this.noFile = noFile
        } else {
            this.noFile = false;
        }
        this.id = date.toISOString() + amount.toString();
        this.toString = this.toString
        this.getHumanReadableDate = this.getHumanReadableDate
        this.getMonthKey = this.getMonthKey
    }

    /**
     * name
     */
    public toString(): string {
        return `${this.date} - ${this.title} - ${this.amount}`
    }

    public getHumanReadableDate(): string {
        return (this.date.getDate()).toLocaleString('fr', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
    }
    public getMonthKey(): number {
        return this.date.getFullYear() * 100 + this.date.getMonth();
    }


}
