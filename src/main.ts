import { Table } from "./libs/table";
import { CurseForgeApi } from "./libs/curseforge";

function routine() {
    let scriptProperties = null;
    try {
        scriptProperties = PropertiesService.getScriptProperties();
    } catch (e) {
        Logger.log(e);
        return;
    }
    const apiKey = scriptProperties.getProperty("CF_API_KEY");
    const spreadsheetId = scriptProperties.getProperty("SPREADSHEET_ID");
    const modId = scriptProperties.getProperty("MOD_ID");

    if (apiKey == null) {
        throw Error("Please set property `CF_API_KEY`");
    }

    if (spreadsheetId == null) {
        throw Error("Please set property `SPREADSHEET_ID`");
    }

    if (modId == null) {
        throw Error("Please set property `MOD_ID`");
    }

    const api = new CurseForgeApi(apiKey);
    const files: File[] = api.getModFiles(229503);
    const totalDownloads = api.getMod(modId).data.downloadCount;

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const columns = ["date", "total_downloads"];
    const table = new Table(spreadsheet, "downloads", columns);

    const objRow = {
        date: new Date(),
        total_downloads: totalDownloads
    };
    
    files.forEach((file: File) => {
        const name = `${file.gameVersions[0]}_${file.displayName}`;
        objRow[name] = file.downloadCount;
    });

    table.updateColumnNames(Object.keys(objRow));
    table.insert([objRow]);
}