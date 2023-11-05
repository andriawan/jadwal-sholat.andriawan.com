import type Coordinate from "./Coordinate";
import type PrayerDate from "./PrayerDate";
import type PrayerSchedule from "./PrayerSchedule";

export default interface Schedule {
    id: string,
    location: string,
    area: string,
    coordinate: Coordinate,
    schedule: PrayerSchedule,
    date: PrayerDate
}