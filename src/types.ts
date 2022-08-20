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

interface ModLinks {
    websiteUrl: string,
    wikiUrl: string,
    issuesUrl: string,
    sourceUrl: string
}

enum ModStatus {
    New = 1,
    ChangesRequired = 2,
    UnderSoftReview = 3,
    Approved = 4,
    Rejected = 5,
    ChangesMade = 6,
    Inactive = 7,
    Abandoned = 8,
    Deleted = 9,
    UnderReview = 10
}

interface Category {
    id: number,
    gameId: number,
    name: string,
    slug: string,
    url: string,
    iconUrl: string,
    dateModified: string,
    isClass: boolean | null,
    classId: number | null,
    parentCategoryId: number | null,
    displayIndex: number | null,
}

interface ModAuthor {
    id: number,
    name: string,
    url: string,
}

interface ModAsset {
    id: number,
    modId: number,
    title: string,
    description: string,
    thumbnailUrl: string,
    url: string,
}

enum ModLoaderType {
    Any = 0,
    Forge = 1,
    Cauldron = 2,
    LiteLoader = 3,
    Fabric = 4,
    Quilt = 5,
}

interface FileIndex {
    gameVersion: string,
    fileId: number,
    filename: string,
    releaseType: FileReleaseType,
    gameVersionTypeId: number | null,
    modLoader: ModLoaderType,
}

interface Mod {
    id: number,
    gameId: number,
    name: string,
    slug: string,
    links: ModLinks,
    summary: string,
    status: ModStatus,
    downloadCount: number,
    isFeatured: boolean,
    primaryCategoryId: number,
    categories: Category[],
    classId: number | null,
    authors: ModAuthor[],
    logo: ModAsset,
    screenshots: ModAsset[],
    mainFileId: number,
    latestFiles: File[],
    latestFilesIndexes: FileIndex[],
    dateCreated: string,
    dateModified: string,
    dateReleased: string,
    allowModDistribution: boolean | null,
    gamePopularityRank: number,
    isAvailable: boolean,
    thumbsUpCount: number
}

interface GetModResponse {
    data: Mod
}
