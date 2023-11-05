import type Location from "./Location"
import type PrayerScheduleParams from "./PrayerScheduleParams"
import type Schedule from "./Schedule"

export default interface API {
    getListLokasi(): Promise<Location[]>,
    getLokasi(id: String): Promise<Location>
    getPrayerSchedule(params: PrayerScheduleParams): Promise<Schedule>
}