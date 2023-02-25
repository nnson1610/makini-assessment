import * as Airtable from "airtable";
import { config } from "../../env/index";
import { GetResponse, IAirTableConfig } from "./airtable.interface";
import { AirtableBase } from 'airtable/lib/airtable_base';
import { QueryParams } from "airtable/lib/query_params";
import { Service } from "typedi";
import "reflect-metadata";

@Service()
export class AirtableInstance {
    private airtableConfig: IAirTableConfig;
    private instance: AirtableBase;

    constructor() {
        // for running test
        if (!process.env.NODE_ENV) {
            return;
        }
        this.airtableConfig = this.loadAirtableConfig();
        const airtable = new Airtable({
            endpointUrl: this.airtableConfig.endpoint,
            apiKey: this.airtableConfig.apiKey
        });
        this.instance = airtable.base(this.airtableConfig.appKey);
    }

    private loadAirtableConfig = (): IAirTableConfig => {
        const airtableConfig = {
            apiKey: config.AIRTABLE_API_KEY,
            appKey: config.AIRTABLE_APP_KEY,
            endpoint: config.AIRTABLE_ENDPOINT
        };
        return airtableConfig;
    }

    public async get<T extends Airtable.FieldSet>(tableName: string, params?: QueryParams<T>): Promise<GetResponse<T>[]> {
        try {
            let response = await this.instance<T>(tableName).select(params).all();
            return response.map((item: Airtable.Record<T>) => {
                return {
                    recordId: item.id, // the id of airtable row
                    data: item.fields
                }
            });
        } catch (error) {
            throw error;
        }
    }
}