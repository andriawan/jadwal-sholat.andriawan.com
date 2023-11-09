import type CalendarMapper from "./CalendarMapper";
import type Hijri from "./Hijri";

export default interface CalendarAPI {
    getHijriCalendar(date: string) : Promise<Hijri>
    mapHijriMonth(mapper: CalendarMapper, code: number): string
}