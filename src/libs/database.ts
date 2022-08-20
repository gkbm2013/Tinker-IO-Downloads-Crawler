import Table from "./table";

export interface DownloadCount {
    date: Date,
    counts: number
}

export class DownloadsTable extends Table {
    constructor(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, tableName: string) {
        super(spreadSheet, tableName, ["date", "counts"]);
    }

    insert(rows: DownloadCount[]): void {
        super.insert(rows);
    }
}
