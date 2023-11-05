import type Coordinate from "./Coordinate";
import type PrayerDate from "./PrayerDate";
import type PrayerSchedule from "./PrayerSchedule";

export default interface Schedule {
    id: String,
    location: String,
    area: String,
    coordinate: Coordinate,
    schedule: PrayerSchedule,
    date: PrayerDate
}