import type APIConfig from '../contracts/APIConfig';

export default abstract class BaseAPI implements APIConfig {
	base_url: string = '';
	version: string = '';
	source?: string | undefined;
	offlineStorage?: Storage | undefined;

	getBaseUrl(): string {
		return this.base_url;
	}

	getVersion(): string {
		return this.version;
	}

	getFullUrl(): string {
		let version = '';
		if (this.getVersion()) {
			version = '/'.concat(this.getVersion());
		}
		return `${this.getBaseUrl()}${version}`;
	}

	getSourceLink(): string {
		return this.source ?? '';
	}
}
