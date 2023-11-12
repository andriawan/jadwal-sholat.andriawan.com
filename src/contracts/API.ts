import type Location from "./Location"
import type PrayerScheduleParams from "./PrayerScheduleParams"
import type Schedule from "./Schedule"

export default interface PrayerTimesAPI {
    getListLokasi(): Promise<Location[]>,
    getLokasi(id: string): Promise<Location>
    getPrayerSchedule(params: PrayerScheduleParams): Promise<Schedule>
    getPrayerScheduleList(params: PrayerScheduleParams): Promise<Schedule[]>
}