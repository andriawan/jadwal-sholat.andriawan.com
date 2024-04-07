import QueryString from 'qs';
import type PrayerTimesAPI from '../contracts/API';
import type Coordinate from '../contracts/Coordinate';
import type Location from '../contracts/Location';
import type PrayerDate from '../contracts/PrayerDate';
import type PrayerSchedule from '../contracts/PrayerSchedule';
import type PrayerScheduleParams from '../contracts/PrayerScheduleParams';
import type Request from '../contracts/Request';
import type Schedule from '../contracts/Schedule';
import BaseAPI from './BaseAPI';
import FetchRequest from './FetchRequest';

export default class Aladhan extends BaseAPI implements PrayerTimesAPI {
	base_url: string = 'https://api.aladhan.com';
	version: string = 'v1';
	source?: string | undefined = 'https://github.com/andriawan/jadwal-sholat.andriawan.com';
	static instance: Aladhan = new Aladhan();
	fetcher: Request = new FetchRequest();

	static getInstance(): Aladhan {
		if (this.instance) return this.instance;
		return new Aladhan();
	}

	async getListLokasi(): Promise<Location[]> {
		const data = await this.fetcher.fetch(`/districs.json`);
		const list: Location[] = data.map(
			(val: { id: string; name: string; latitude: number; longitude: number }) => {
				const lokasi: Location = {
					id: val.id,
					location: val.name,
					lat: val.latitude,
					long: val.longitude
				};
				return lokasi;
			}
		);
		return list;
	}
	
	getLokasi(id: string): Promise<Location> {
		throw new Error('Method not implemented.');
	}

	async getPrayerSchedule(params: PrayerScheduleParams): Promise<Schedule> {
		const lists = await this.getPrayerScheduleList(params);
		const schedule = lists.find((data) => {
			return parseInt(data.date.date) === parseInt(params.date ?? '-');
		});
		if (schedule) {
			schedule.location = params.location ?? '-';
			return schedule;
		}
		return {
			id: '',
			location: '',
			area: '',
			coordinate: {
				bujur: '',
				lintang: '',
				lat: '',
				long: ''
			},
			date: {
				date: '',
				full_date: ''
			},
			schedule: {
				ashar: '',
				dhuha: '',
				dzuhur: '',
				imsak: '',
				isya: '',
				maghrib: '',
				subuh: '',
				terbit: ''
			}
		};
	}
	async getPrayerScheduleList(params: PrayerScheduleParams): Promise<Schedule[]> {
		const query = QueryString.stringify({
			latitude: params.lat,
			longitude: params.long,
			adjustment: -1,
			tune: `2,2,0,3,1,3,0,2`
		});
		const yearMonth = `/${params.year}/${params.month}`;
		let data = await this.fetcher.fetch(`${this.getFullUrl()}/calendar${yearMonth}?${query}`);
		data = data.data;
		const scheduleList: Schedule[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data?.forEach((jadwal: any) => {
			const date: PrayerDate = {
				full_date: jadwal.date.gregorian.date,
				date: jadwal.date.gregorian.day
			};
			const coordinate: Coordinate = {
				lat: jadwal.meta.latitude,
				long: jadwal.meta.longitude,
				bujur: '-',
				lintang: '-'
			};
			const prayerSchedule: PrayerSchedule = {
				imsak: jadwal.timings.Imsak,
				subuh: jadwal.timings.Fajr,
				terbit: jadwal.timings.Sunrise,
				dhuha: jadwal.timings.Sunrise,
				dzuhur: jadwal.timings.Dhuhr,
				ashar: jadwal.timings.Asr,
				maghrib: jadwal.timings.Maghrib,
				isya: jadwal.timings.Isha
			};
			const schedule: Schedule = {
				id: jadwal.date.gregorian.day,
				location: '-',
				area: '-',
				coordinate,
				schedule: prayerSchedule,
				date
			};
			scheduleList.push(schedule);
		});
		return scheduleList;
	}
}
