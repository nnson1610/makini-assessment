import * as Airtable from "airtable";

export interface IAirTableConfig {
    apiKey: string;
    appKey: string;
    endpoint: string;
}

export interface GetResponse<T> extends Airtable.Table<T> {
    recordId: string; // recordId of airtable row
    data: T;
}