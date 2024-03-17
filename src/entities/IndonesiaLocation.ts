import type Location from "../contracts/Location";
import type LocationAPI from "../contracts/LocationAPI";
import type Request from "../contracts/Request";
import BaseAPI from "./BaseAPI";
import FetchRequest from "./FetchRequest";

export default class IndonesiaLocation extends BaseAPI implements LocationAPI {
    base_url: string = "https://wilayah.id/api";
    version: string = "v1";
    source?: string | undefined = "https://github.com/andriawan/jadwal-sholat.andriawan.com";
    static instance: IndonesiaLocation = new IndonesiaLocation();
    fetcher: Request = new FetchRequest();

    static getInstance(): IndonesiaLocation {
        if(this.instance) return this.instance;
        return new IndonesiaLocation();
    }

    async getProvinces(): Promise<Location[]> {
        let data = await this.fetcher.fetch(`${this.getFullUrl()}/province.json`);
        let list: Location[] = data.map((val: { 
            code: any; name: any; coordinate: {lat: any, long: any} }) => {
            let lokasi: Location = {
                id: val.code,
                location: val.name,
                lat: val.coordinate.lat,
                long: val.coordinate.long
            }
            return lokasi;
        })
        return list;
    }
    async getRegencies(province_id: string): Promise<Location[]> {
        let data = await this.fetcher.fetch(`${this.getFullUrl()}/regencies/${province_id}].json`);
        let list: Location[] = data.map((val: { 
            code: any; name: any; coordinate: {lat: any, long: any} }) => {
            let lokasi: Location = {
                id: val.code,
                location: val.name,
                lat: val.coordinate.lat,
                long: val.coordinate.long
            }
            return lokasi;
        })
        return list;
        
    }
    async getDistrics(regency_id: string): Promise<Location[]> {
        let data = await this.fetcher.fetch(`${this.getFullUrl()}/districts/${regency_id}].json`);
        let list: Location[] = data.map((val: { 
            code: any; name: any; coordinate: {lat: any, long: any} }) => {
            let lokasi: Location = {
                id: val.code,
                location: val.name,
                lat: val.coordinate.lat,
                long: val.coordinate.long
            }
            return lokasi;
        })
        return list;
    }    
}