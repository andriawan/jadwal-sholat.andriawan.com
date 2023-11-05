import type APIConfig from "../contracts/APIConfig";
import type APIContract from "../contracts/API";
import type Coordinate from "../contracts/Coordinate";
import type Location from "../contracts/Location";
import type PrayerSchedule from "../contracts/PrayerSchedule";
import type PrayerScheduleParams from "../contracts/PrayerScheduleParams";
import type Schedule from "../contracts/Schedule";

export default class MyQuran implements APIConfig, APIContract {
    base_url: String = "https://api.myquran.com";
    version: String = "v1";

    async getListLokasi(): Promise<Location[]> {
        let data: any = await (await fetch(`${this.base_url}/${this.version}/sholat/kota/semua`)).json()
        let list: Location[] = data.map((val: { id: any; lokasi: any; }) => {
            let lokasi: Location = {
                id: val.id,
                location: val.lokasi
            }
            return lokasi;
        })
        return list
    }

    async getLokasi(id: String): Promise<Location> {
        let data: any = await (await fetch(`${this.base_url}/${this.version}/sholat/kota/id/${id}`)).json()
        let lokasi: Location = {
            id: data.data.id,
            location: data.data.lokasi
        }
        return lokasi;
    }

    async getPrayerSchedule(params: PrayerScheduleParams): Promise<Schedule> {
        let data: any = await (await fetch(`${this.base_url}/${this.version}/sholat/jadwal/${params.id}/${params.year}/${params.month}/${params?.date}`)).json()
        data = data.data;
        let coordinate: Coordinate = {
            lat: data.koordinat.lat,
            long: data.koordinat.long,
            bujur: data.koordinat.bujur,
            lintang: data.koordinat.lintang
        };
        let prayerSchedule: PrayerSchedule = {
            full_date: data.jadwal.tanggal,
            date: data.jadwal.date,
            subuh: data.jadwal.subuh,
            dzuhur: data.jadwal.dzuhur,
            dhuha: data.jadwal.dhuha,
            ashar: data.jadwal.ashar,
            maghrib: data.jadwal.maghrib,
            isya: data.jadwal.isya,
            imsak: data.jadwal.imsak,
            terbit: data.jadwal.terbit
        }
        let schedule: Schedule = {
            id: data.id,
            location: data.lokasi,
            area: data.area,
            coordinate,
            schedule: prayerSchedule
        }
        return schedule;
    }

    
}