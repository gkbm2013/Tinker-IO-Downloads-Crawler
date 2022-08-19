import CurseForgeApi from "./libs/curseforge";

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
