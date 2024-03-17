import type Location from "./Location";

export default interface LocationAPI {
    getProvinces(): Promise<Location[]>,
    getRegencies(province_id: string): Promise<Location[]>,
    getDistrics(regency_id: string): Promise<Location[]>
}