import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInWeeks, differenceInYears, format, formatDistance, getDate, getMonth, getYear, toDate, type Locale } from "date-fns";
import type Time from "../contracts/Time";

export default class DateFnsTime implements Time {

    date: Date;
    locale: Locale;
    static instance: DateFnsTime;

    constructor(date: Date, locale: Locale) {
        this.date = date;
        this.locale = locale;
    }

    static getInstance(date: Date, locale: Locale) {
        if(!this.instance) this.instance = new DateFnsTime(date, locale);
        return this.instance;
    }

    getDate(): number {
        return getDate(this.date);
    }

    getMonth(): number {
        return getMonth(this.date);
    }

    getYear(): number {
        return getYear(this.date);
    }
    getTodayDate(): Date {
        return new Date();
    }
    getToday(): string {
        throw new Error("Method not implemented.");
    }
    getDiffTime(date1: Date, date2: Date, identfier: 's' | 'm' | 'h' | 'd' | 'w' | 'b' | 'y' | 'native' ): number | string {
        if(identfier === 'native') {
            return formatDistance(date1, date2, {locale: this.locale})
        }
        let mapper: Record<string, number> = {
            "s": differenceInSeconds(date1, date2),
            "m": differenceInMinutes(date1, date2),
            "h": differenceInHours(date1, date2),
            "d": differenceInDays(date1, date2),
            "w": differenceInWeeks(date1, date2),
            "b": differenceInMonths(date1, date2),
            "y": differenceInYears(date1, date2)
        }
        return mapper[identfier];
    }
    format(pattern: string, date: Date): string {
        return format(date, pattern);
    }

}