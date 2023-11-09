export default interface APIConfig {
    base_url: string
    version: string
    source?: string
    offlineStorage?: Storage
    getBaseUrl(): string
    getVersion(): string
    getFullUrl(): string
    getSourceLink?(): string | undefined
}