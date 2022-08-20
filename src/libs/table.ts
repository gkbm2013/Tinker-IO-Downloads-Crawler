class Table {
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    tableName: string;
    columnNames: string[];
    sheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, tableName: string, columnNames: string[]) {
        this.spreadSheet = spreadSheet;
        this.tableName = tableName;
        this.columnNames = columnNames;
        this.sheet = this.ensureSheet(tableName, columnNames);

        const currentColumns = this.getColumnNames();
        for (let i = 0; i < columnNames.length; i++) {
            if (currentColumns[i] !== columnNames[i]) {
                throw new Error(`The ${i + 1}th column is invalid.`);
            }
        }
        this.columnNames = currentColumns;
    }

    getColumnNames(): string[] {
        const sheet = this.ensureSheet(this.tableName, this.columnNames);
        return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    updateColumnNames(newColumnNames: string[]): void {
        const currentColumns = this.getColumnNames();
        const colsToAdd: string[] = [];
        newColumnNames.forEach((col) => {
            if (!currentColumns.includes(col)) {
                colsToAdd.push(col);
            }
        });
        if (colsToAdd.length > 0) {
            const sheet = this.ensureSheet(this.tableName, this.columnNames);
            sheet.getRange(1, sheet.getLastColumn() + 1, 1, colsToAdd.length).setValues([colsToAdd]);
        }
    }

    isSheetExisted(name: string): boolean {
        const sheet = this.spreadSheet.getSheetByName(name);
        return (sheet != null);
    }

    ensureSheet(name: string, columnNames: string[]): GoogleAppsScript.Spreadsheet.Sheet {
        const flag = this.isSheetExisted(name);
        const sheet = this.createSheet(name);
        if (!flag) {
            sheet.getRange(1, 1, 1, columnNames.length).setValues([
                columnNames
            ]);
        }
        return sheet;
    }

    createSheet(name: string): GoogleAppsScript.Spreadsheet.Sheet {
        if (!this.isSheetExisted(name)) {
            const newSheet = this.spreadSheet.insertSheet();
            newSheet.setName(name);
            return newSheet;
        } else {
            return this.spreadSheet.getSheetByName(name);
        }
    }

    isColumnsValid(cols: string[]): boolean {
        return this.columnNames.length === cols.length && this.columnNames.every(function (value, index) { return value === cols[index]; });
    }

    insert(rows: object[]) {
        const rowsToSheet = [];
        rows.forEach((row: object) => {
            if (!this.isColumnsValid(Object.keys(row))) {
                throw new Error("Invalid columns.");
            }

            const rowToSheet = [];

            for (const i in this.columnNames) {
                const colName = this.columnNames[i];
                rowToSheet.push(row[colName]);
            }

            rowsToSheet.push(rowToSheet);
        });
        const lastRow = this.sheet.getLastRow();
        this.sheet.getRange(lastRow + 1, 1, rowsToSheet.length, this.columnNames.length).setValues(rowsToSheet);
    }
}

export default Table;
