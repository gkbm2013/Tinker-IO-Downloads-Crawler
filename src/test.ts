import { CurseForgeApi } from "./libs/curseforge";
import Talbe from "./libs/table";

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
    const table = new Talbe(spreadSheet, "test", ["time", "counts"]);
    table.insert([
        {"time": new Date(), "counts": 10},
        {"time": new Date(), "counts": 20},
    ]);
}
