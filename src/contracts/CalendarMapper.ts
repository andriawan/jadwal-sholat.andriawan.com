export default interface CalendarMapper {
    code: string[];
    map(code: number): string
}