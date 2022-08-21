import { Table } from "./libs/table";
import { CurseForgeApi } from "./libs/curseforge";

interface Properties {
    cfApiKey: string,
    spreadsheetId: string,
    modId: number
}

interface SimpleModFile {
    displayName: string,
    gameVersion: string,
    fileDate: string,
    downloadCount: number,
}

function getProperties(): Properties {
    let scriptProperties = null;
    try {
        scriptProperties = PropertiesService.getScriptProperties();
    } catch (e) {
        Logger.log(e);
        return;
    }

    const properties: Properties = {
        cfApiKey: scriptProperties.getProperty("CF_API_KEY"),
        spreadsheetId: scriptProperties.getProperty("SPREADSHEET_ID"),
        modId: parseInt(scriptProperties.getProperty("MOD_ID")),
    };

    if (properties.cfApiKey == null) {
        throw Error("Please set property `CF_API_KEY`");
    }

    if (properties.spreadsheetId == null) {
        throw Error("Please set property `SPREADSHEET_ID`");
    }

    if (properties.modId == null) {
        throw Error("Please set property `MOD_ID`");
    }

    return properties;
}

function getDownloadsTable(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Table {
    const columns = ["date", "total_downloads"];
    return new Table(spreadsheet, "downloads", columns);
}

function getStatisticTable(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Table {
    const columns = ["name", "value"];
    return new Table(spreadsheet, "statistic", columns);
}

function routine() {
    const properties: Properties = getProperties();

    const api = new CurseForgeApi(properties.cfApiKey);
    const files: File[] = api.getModFiles(properties.modId);
    const totalDownloads = api.getMod(properties.modId).data.downloadCount;
    const spreadsheet = SpreadsheetApp.openById(properties.spreadsheetId);

    const table = getDownloadsTable(spreadsheet);

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

    updateFileList(table.spreadSheet, files);
    updateStatistic(spreadsheet);
}

function updateStatistic(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    const table = getDownloadsTable(spreadsheet);

    const columns = table.getColumnNames();
    const allData = [];
    const n = 1;
    const lastRow = table.sheet.getLastRow();
    let i = 1;
    let firstRow = null;

    let data: any[][] | null = null;
    do {
        firstRow = lastRow - (n * i) + 1;
        firstRow = (firstRow < 2) ? 2 : firstRow;
        data = table.getRows(firstRow, lastRow - (n * (i - 1)));
        allData.unshift(...data);
        i++;
    } while (firstRow != 2 && allData.length > 0 && allData[0][0] > new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000));

    const idxDate = columns.indexOf("date");
    const idxTotalDownloads = columns.indexOf("total_downloads");

    let rowOneWeekAgo = 0;
    let rowOneDayAgo = 0;
    const dateOneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateOneDayAgo = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);

    for (let i = 1; i < allData.length; i++) {
        const rowA = allData[i - 1];
        const rowB = allData[i];
        if (rowOneWeekAgo == 0) {
            if (rowA[idxDate] < dateOneWeekAgo && rowB[idxDate] >= dateOneWeekAgo) {
                rowOneWeekAgo = i;
            }
        }

        if (rowOneDayAgo == 0) {
            if (rowA[idxDate] < dateOneDayAgo && rowB[idxDate] >= dateOneDayAgo) {
                rowOneDayAgo = i;
            }
        }
    }

    const statistic = {
        totalDownloads: allData[allData.length - 1][idxTotalDownloads],
        monthlyDownloads: allData[allData.length - 1][idxTotalDownloads] - allData[0][idxTotalDownloads],
        weeklyDownloads: allData[allData.length - 1][idxTotalDownloads] - allData[rowOneWeekAgo][idxTotalDownloads],
        dailyDownloads: allData[allData.length - 1][idxTotalDownloads] - allData[rowOneDayAgo][idxTotalDownloads],
    };

    const statisticTable = getStatisticTable(spreadsheet);
    statisticTable.sheet.deleteRows(2, 4);
    statisticTable.sheet.insertRowsAfter(2, 4);
    statisticTable.insert(Object.entries(statistic).map(item => {
        return { name: item[0], value: item[1] };
    }));
}

function getLastFiles(files: File[], releaseType: FileReleaseType): SimpleModFile[] {
    const filesByGameVersion = new Map<string, File[]>();
    files.forEach((file) => {
        if (file.releaseType == releaseType) {
            const gameVersion = file.gameVersions[0];
            if (!filesByGameVersion.has(gameVersion)) {
                filesByGameVersion.set(gameVersion, []);
            }
            filesByGameVersion.get(gameVersion).push(file);
        }
    });

    const arrRecommendation = [];

    filesByGameVersion.forEach((value) => {
        const file: File = value.sort((a, b) => {
            return new Date(b.fileDate).getTime() - new Date(a.fileDate).getTime();
        })[0];
        arrRecommendation.push({
            displayName: file.displayName,
            gameVersion: file.gameVersions[0],
            fileDate: file.fileDate,
            downloadCount: file.downloadCount
        } as SimpleModFile);
    });

    return arrRecommendation;
}

function clearTable(table: Table) {
    const toClearNum = table.sheet.getLastRow() - 2 + 1;
    if (toClearNum <= 0) {
        return;
    }
    table.sheet.deleteRows(2, toClearNum);
    table.sheet.insertRowsAfter(2, toClearNum);
}

function updateFileList(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, files: File[]) {
    const arrFilesRecommendation: SimpleModFile[] = getLastFiles(files, FileReleaseType.Release);
    const arrFilesBeta: SimpleModFile[] = getLastFiles(files, FileReleaseType.Beta);
    const arrFilesAlpha: SimpleModFile[] = getLastFiles(files, FileReleaseType.Alpha);
    const arrPopular: SimpleModFile[] = files.sort((a, b) => b.downloadCount - a.downloadCount).filter((file, index) => index < 5).map(file => {
        return {
            displayName: file.displayName,
            gameVersion: file.gameVersions[0],
            fileDate: file.fileDate,
            downloadCount: file.downloadCount
        } as SimpleModFile;
    });


    const columns = ["displayName", "gameVersion", "fileDate", "downloadCount"];

    const tableRecommendation = new Table(spreadsheet, "recommendation", columns);
    clearTable(tableRecommendation);
    tableRecommendation.insert(arrFilesRecommendation);

    const tableBeta = new Table(spreadsheet, "beta", columns);
    clearTable(tableBeta);
    tableBeta.insert(arrFilesBeta);

    const tableAlpha = new Table(spreadsheet, "alpha", columns);
    clearTable(tableAlpha);
    tableAlpha.insert(arrFilesAlpha);

    const tablePopular = new Table(spreadsheet, "popular", columns);
    clearTable(tablePopular);
    tablePopular.insert(arrPopular);
}
