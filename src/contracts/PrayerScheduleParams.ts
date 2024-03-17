export default interface PrayerScheduleParams {
    id: string,
    year: string,
    month: string,
    date?: string,
    additionalId?: string,
    forceClear?: boolean,
    lat?: string,
    long?: string,
    location?: string
}