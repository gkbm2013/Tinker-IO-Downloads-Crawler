import * as URI from "uri-js";

export class CurseForgeApi {
    apiKey: string;
    endpointHost: string;

    constructor(apiKey: string, endpointHost = "api.curseforge.com") {
        this.apiKey = apiKey;
        this.endpointHost = endpointHost;
    }

    fetch(requestPath: string, query?: string): GoogleAppsScript.URL_Fetch.HTTPResponse {
        const comonents: URI.URIComponents = { scheme: "https", host: this.endpointHost, path: requestPath };
        if (query) {
            comonents.query = query;
        }
        const uri = URI.serialize(comonents);
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            "method": "get",
            "headers": {
                "x-api-key": this.apiKey,
                "Accept": "application/json"
            }
        };
        const response = UrlFetchApp.fetch(uri, options);
        return response;
    }

    getGameVersions(gameId: number): GetVersionsResponse {
        const requestPath = `/v1/games/${gameId}/versions`;
        const response = this.fetch(requestPath);
        if (response.getResponseCode() != 200) {
            throw new Error(`Server error: ${response.getResponseCode()}`);
        }
        const verResp: GetVersionsResponse = JSON.parse(response.getContentText());
        return verResp;
    }

    getMinecraftVersions(): GetVersionsResponse {
        return this.getGameVersions(432);
    }

    getModFiles(modId: number): File[] {
        const pageSize = 50;

        let currentIndex = 0;
        let remaining = -1;

        const files: File[] = [];

        while (remaining != 0) {
            const requestPath = `/v1/mods/${modId}/files`;
            const query = `index=${currentIndex}&pageSize=${pageSize}`;
            const response = this.fetch(requestPath, query);
            if (response.getResponseCode() != 200) {
                throw new Error(`Server error: ${response.getResponseCode()}`);
            }
            const filesResp: GetModFilesResponse = JSON.parse(response.getContentText());
            const pagination = filesResp.pagination;
            remaining = pagination.totalCount - (pagination.index + pagination.resultCount);
            currentIndex = pagination.index + pagination.resultCount;
            files.push(...filesResp.data);
        }

        return files;
    }

    getMod(modId: number): GetModResponse {
        const requestPath = `/v1/mods/${modId}`;
        const response = this.fetch(requestPath);
        if (response.getResponseCode() != 200) {
            throw new Error(`Server error: ${response.getResponseCode()}`);
        }
        const modResp: GetModResponse = JSON.parse(response.getContentText());
        return modResp;
    }
}
