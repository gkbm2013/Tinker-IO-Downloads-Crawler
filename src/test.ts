// import { CurseForgeApi } from "./libs/curseforge";
// import { Table } from "./libs/table";

// function testGetMcVersions() {
//     let scriptProperties = null;
//     try {
//         scriptProperties = PropertiesService.getScriptProperties();
//     } catch (e) {
//         Logger.log(e);
//         return;
//     }
//     const apiKey = scriptProperties.getProperty("CF_API_KEY");
//     if (apiKey == null) {
//         throw Error("Please set property `CF_API_KEY`");
//     }
//     const api = new CurseForgeApi(apiKey);
//     return api.getMinecraftVersions();
// }

// function testGetModFiles() {
//     let scriptProperties = null;
//     try {
//         scriptProperties = PropertiesService.getScriptProperties();
//     } catch (e) {
//         Logger.log(e);
//         return;
//     }
//     const apiKey = scriptProperties.getProperty("CF_API_KEY");
//     if (apiKey == null) {
//         throw Error("Please set property `CF_API_KEY`");
//     }
//     const api = new CurseForgeApi(apiKey);
//     return api.getModFiles(229503);
// }

// function testInsertTable() {
//     const spreadSheet = SpreadsheetApp.openById("145xJiXMwozR8AyCxW1mjXgMZ0UWxNIcAAORbdGysjgQ");
//     const table = new Table(spreadSheet, "test", ["time", "counts", "x"]);
//     table.insert([
//         {"time": new Date(), "counts": 10, "x": 30},
//         {"time": new Date(), "counts": 20, "x": 40},
//     ]);
// }

// function testUpdateColumn() {
//     const spreadSheet = SpreadsheetApp.openById("145xJiXMwozR8AyCxW1mjXgMZ0UWxNIcAAORbdGysjgQ");
//     const table = new Table(spreadSheet, "test", ["time", "counts", "x"]);
//     table.updateColumnNames(["time", "counts", "x", "a", "b"]);
//     return {
//         "col": table.getColumnNames()
//     };
// }

// function testGetMod() {
//     let scriptProperties = null;
//     try {
//         scriptProperties = PropertiesService.getScriptProperties();
//     } catch (e) {
//         Logger.log(e);
//         return;
//     }
//     const apiKey = scriptProperties.getProperty("CF_API_KEY");
//     if (apiKey == null) {
//         throw Error("Please set property `CF_API_KEY`");
//     }
//     const api = new CurseForgeApi(apiKey);
//     return api.getMod(229503).data.downloadCount;
// }
//
// function testGetLastRow() {
//     let scriptProperties = null;
//     try {
//         scriptProperties = PropertiesService.getScriptProperties();
//     } catch (e) {
//         Logger.log(e);
//         return;
//     }

//     const spreadsheetId = scriptProperties.getProperty("SPREADSHEET_ID");

//     if (spreadsheetId == null) {
//         throw Error("Please set property `SPREADSHEET_ID`");
//     }

//     const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
//     const columns = ["date", "total_downloads"];
//     const table = new Table(spreadsheet, "downloads", columns);

//     const allData = [];
//     const n = 1;
//     const lastRow = table.sheet.getLastRow();
//     let i = 1;
//     let firstRow = null;

//     let data: any[][] | null = null;
//     do {
//         firstRow = lastRow-(n*i)+1;
//         firstRow = (firstRow < 2)? 2 : firstRow;
//         data = table.getRows(firstRow, lastRow-(n*(i-1)));
//         allData.unshift(...data);
//         i++;
//     } while(firstRow != 2 && allData.length > 0 && allData[0][0] > new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000));
    
//     // data = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
//     // data[0][0]
//     Logger.log(allData);
// }

// function testUpdateFileList() {
//     const properties = getProperties();
//     const api = new CurseForgeApi(properties.cfApiKey);
//     const files = api.getModFiles(properties.modId);
//     const spreadsheet = SpreadsheetApp.openById(properties.spreadsheetId);
//     updateFileList(spreadsheet, files);
// }
