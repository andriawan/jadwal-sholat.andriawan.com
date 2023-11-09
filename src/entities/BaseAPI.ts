import type APIConfig from "../contracts/APIConfig";

export default abstract class BaseAPI implements APIConfig {
    base_url: string = "";
    version: string = "";
    source?: string | undefined;
    offlineStorage?: Storage | undefined;

    getBaseUrl(): string {
        return this.base_url;
    }

    getVersion(): string {
        return this.version;
    }
    
    getFullUrl(): string {
        return `${this.getBaseUrl()}/${this.getVersion()}`
    }

    getSourceLink(): string {
        return this.source ?? ""
    }

}