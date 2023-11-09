import type Coordinate from "../contracts/Coordinate";
import type Location from "../contracts/Location";
import type PrayerSchedule from "../contracts/PrayerSchedule";
import type PrayerScheduleParams from "../contracts/PrayerScheduleParams";
import type Schedule from "../contracts/Schedule";
import type PrayerDate from "../contracts/PrayerDate";
import BaseAPI from "./BaseAPI";
import type PrayerTimesAPI from "../contracts/API";

export default class MyQuran extends BaseAPI implements PrayerTimesAPI {
    base_url: string = "https://api.myquran.com";
    version: string = "v1";
    source?: string | undefined = "https://github.com/andriawan/jadwal-sholat.andriawan.com";
    static instance: MyQuran = new MyQuran();

    static getInstance(): MyQuran {
        if(this.instance) return this.instance;
        return new MyQuran();
    }

    async getListLokasi(): Promise<Location[]> {
        let data = await this.offlineStorageWrapper(async () => {
            return await (await fetch(`${this.getFullUrl()}/sholat/kota/semua`)).json();
        }, "getListLokasi");

        let list: Location[] = data.map((val: { id: any; lokasi: any; }) => {
            let lokasi: Location = {
                id: val.id,
                location: val.lokasi
            }
            return lokasi;
        })
        return list
    }

    async offlineStorageWrapper(callback: Function, id: string, forceClear: boolean = false) {
        if(forceClear) {
            localStorage.removeItem(id)
        }
        let data: any;
        let localData: any = localStorage.getItem(id);
        if (localData) {
            data = JSON.parse(localData);
        } else {
            data = await callback()
            localStorage.setItem(id, JSON.stringify(data));
        }
        return data
    }

    async getLokasi(id: String): Promise<Location> {
        let data = await this.offlineStorageWrapper(async () => {
            return await (await fetch(`${this.getFullUrl()}/sholat/kota/id/${id}`)).json()
        }, "getLokasi");
        let lokasi: Location = {
            id: data.data.id,
            location: data.data.lokasi
        }
        return lokasi;
    }

    async getPrayerSchedule(params: PrayerScheduleParams): Promise<Schedule> {
        let data = await this.offlineStorageWrapper(async () => {
            return await (await fetch(`${this.getFullUrl()}/sholat/jadwal/${params.id}/${params.year}/${params.month}/${params?.date}`)).json()
        }, `getPrayerSchedule${params.additionalId ?? ''}`, params.forceClear);

        data = data.data;

        let coordinate: Coordinate = {
            lat: data.koordinat.lat,
            long: data.koordinat.long,
            bujur: data.koordinat.bujur,
            lintang: data.koordinat.lintang
        };
        let prayerSchedule: PrayerSchedule = {
            imsak: data.jadwal.imsak,
            subuh: data.jadwal.subuh,
            terbit: data.jadwal.terbit,
            dhuha: data.jadwal.dhuha,
            dzuhur: data.jadwal.dzuhur,
            ashar: data.jadwal.ashar,
            maghrib: data.jadwal.maghrib,
            isya: data.jadwal.isya,

        }
        let date: PrayerDate = {
            full_date: data.jadwal.tanggal,
            date: data.jadwal.date,
        }
        let schedule: Schedule = {
            id: data.id,
            location: data.lokasi,
            area: data.area,
            coordinate,
            schedule: prayerSchedule,
            date
        }
        return schedule;
    }


}