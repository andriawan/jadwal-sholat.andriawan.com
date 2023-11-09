import type CalendarMapper from "../contracts/CalendarMapper";

export default class IndonesiaHijriMapper implements CalendarMapper {
    code: string[] = [
        "Muharram",
        "Shafar",
        "Rabiul Awal",
        "Rabiul Akhir",
        "Jumadil Awal",
        "Jumadil Akhir",
        "Rajab",
        "Syaban",
        "Ramadhan",
        "Syawal",
        "Dzulqoidah",
        "Dzulhijah"
    ];
    map(code: number): string {
        return this.code[code - 1]
    }
    
}