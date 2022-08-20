import { CurseForgeApi } from "./libs/curseforge";
import { Table } from "./libs/table";

function testGetMcVersions() {
    let scriptProperties = null;
    try {
        scriptProperties = PropertiesService.getScriptProperties();
    } catch (e) {
        Logger.log(e);
        return;
    }
    const apiKey = scriptProperties.getProperty("CF_API_KEY");
    if (apiKey == null) {
        throw Error("Please set property `CF_API_KEY`");
    }
    const api = new CurseForgeApi(apiKey);
    return api.getMinecraftVersions();
}

function testGetModFiles() {
    let scriptProperties = null;
    try {
        scriptProperties = PropertiesService.getScriptProperties();
    } catch (e) {
        Logger.log(e);
        return;
    }
    const apiKey = scriptProperties.getProperty("CF_API_KEY");
    if (apiKey == null) {
        throw Error("Please set property `CF_API_KEY`");
    }
    const api = new CurseForgeApi(apiKey);
    return api.getModFiles(229503);
}

function testInsertTable() {
    const spreadSheet = SpreadsheetApp.openById("145xJiXMwozR8AyCxW1mjXgMZ0UWxNIcAAORbdGysjgQ");
    const table = new Table(spreadSheet, "test", ["time", "counts", "x"]);
    table.insert([
        {"time": new Date(), "counts": 10, "x": 30},
        {"time": new Date(), "counts": 20, "x": 40},
    ]);
}

function testUpdateColumn() {
    const spreadSheet = SpreadsheetApp.openById("145xJiXMwozR8AyCxW1mjXgMZ0UWxNIcAAORbdGysjgQ");
    const table = new Table(spreadSheet, "test", ["time", "counts", "x"]);
    table.updateColumnNames(["time", "counts", "x", "a", "b"]);
    return {
        "col": table.getColumnNames()
    };
}

function testGetMod() {
    let scriptProperties = null;
    try {
        scriptProperties = PropertiesService.getScriptProperties();
    } catch (e) {
        Logger.log(e);
        return;
    }
    const apiKey = scriptProperties.getProperty("CF_API_KEY");
    if (apiKey == null) {
        throw Error("Please set property `CF_API_KEY`");
    }
    const api = new CurseForgeApi(apiKey);
    return api.getMod(229503).data.downloadCount;
}
