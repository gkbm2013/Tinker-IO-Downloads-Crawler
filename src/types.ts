enum FileReleaseType {
    Release = 1,
    Beta = 2,
    Alpha = 3,
}

enum FileStatus {
    Processing = 1,
    ChangesRequired = 2,
    UnderReview = 3,
    Approved = 4,
    Rejected = 5,
    MalwareDetected = 6,
    Deleted = 7,
    Archived = 8,
    Testing = 9,
    Released = 10,
    ReadyForReview = 11,
    Deprecated = 12,
    Baking = 13,
    AwaitingPublishing = 14,
    FailedPublishing = 15,
}

enum HashAlgo {
    Sha1 = 1,
    Md5 = 2,
}

interface FileHash {
    value: string,
    algo: HashAlgo
}

interface SortableGameVersion {
    gameVersionName: string,
    gameVersionPadded: string,
    gameVersion: string,
    gameVersionReleaseDate: string,
    gameVersionTypeId: number | null
}

enum FileRelationType {
    EmbeddedLibrary = 1,
    OptionalDependency = 2,
    RequiredDependency = 3,
    Tool = 4,
    Incompatible = 5,
    Include = 6,
}

interface FileDependency {
    modId: number,
    relationType: FileRelationType
}

interface FileModule {
    name: string,
    fingerprint: number
}

interface File {
    id: number,
    gameId: number,
    modId: number,
    isAvailable: boolean,
    displayName: string,
    fileName: string,
    releaseType: FileReleaseType,
    fileStatus: FileStatus,
    hashes: FileHash[],
    fileDate: string,
    fileLength: number,
    downloadCount: number,
    downloadUrl: string,
    gameVersions: string[],
    sortableGameVersions: SortableGameVersion[],
    dependencies: FileDependency[],
    exposeAsAlternative: boolean | null,
    parentProjectFileId: number | null,
    alternateFileId: number | null,
    isServerPack: boolean | null,
    serverPackFileId: number | null,
    fileFingerprint: number,
    modules: FileModule[]
}

interface Pagination {
    index: number,
    pageSize: number,
    resultCount: number,
    totalCount: number
}

interface GetModFilesResponse {
    data: File[],
    pagination: Pagination
}

interface GameVersionsByType {
    type: number,
    versioins: string[]
}

interface GetVersionsResponse {
    data: GameVersionsByType[]
}
