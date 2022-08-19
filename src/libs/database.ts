import Table from "./table";
import { keys } from "ts-transformer-keys";

export interface DownloadCount {
    date: Date,
    counts: number
}

export class DownloadsTable extends Table {
    constructor(spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet, tableName: string) {
        const keysOfProps = keys<DownloadCount>();
        super(spreadSheet, tableName, keysOfProps);
    }
}
