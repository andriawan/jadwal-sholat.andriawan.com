import type Request from '../contracts/Request';

export default class FetchRequest implements Request {
	async fetch(url: string): Promise<any> {
		let cache = JSON.parse(localStorage.getItem(url) ?? 'null');
		if (cache) {
			return cache;
		}
		try {
			const response = await fetch(url);
			const data = await response.json();
			localStorage.setItem(url, JSON.stringify(data));
			return data;
		} catch (error) {
			console.error(`Error fetching data from ${url}: ${error}`);
			throw error;
		}
	}
}
