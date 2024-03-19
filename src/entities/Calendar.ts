import BaseAPI from './BaseAPI';
import type CalendarAPI from '../contracts/CalendarAPI';
import type Hijri from '../contracts/Hijri';
import type CalendarMapper from '../contracts/CalendarMapper';
import FetchRequest from './FetchRequest';
import type Request from '../contracts/Request';

export default class Calendar extends BaseAPI implements CalendarAPI {
	base_url: string = 'https://api.aladhan.com';
	version: string = 'v1';
	static instance: Calendar = new Calendar();
	fetcher: Request = new FetchRequest();

	static getInstance(): Calendar {
		if (this.instance) return this.instance;
		return new Calendar();
	}

	async getHijriCalendar(date: string): Promise<Hijri> {
		let json = await this.fetcher.fetch(`${this.getFullUrl()}/gToH/${date}`);
		let hijri: Hijri = {
			format: json.data.hijri.format,
			date: json.data.hijri.date,
			day: json.data.hijri.day,
			month: json.data.hijri.month.number,
			year: json.data.hijri.year
		};
		return hijri;
	}

	mapHijriMonth(mapper: CalendarMapper, code: number): string {
		return mapper.map(code);
	}
}
