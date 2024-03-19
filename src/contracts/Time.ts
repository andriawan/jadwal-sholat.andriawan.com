export default interface Time {
	getTodayDate(): Date;
	getToday(): string;
	getDiffTime(date1: Date, date2: Date, identfier: string): number | string;
	format(pattern: string, date: Date): string;
	getDate(): number;
	getMonth(): number;
	getYear(): number;
}
