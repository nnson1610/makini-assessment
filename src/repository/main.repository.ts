import { AirtableInstance } from "../airtable/airtable.instance";
import { Model } from '../model/model.model';
import { ModelModel } from '../model/model_model.model';
import { GetQuery } from "../common/interface";
import { DrawingModel } from "../model/drawing.model";
import { ServiceModel } from "../model/service.model";
import { GetResponse } from "../airtable/airtable.interface";
import { AIRTABLE_NAME } from "../airtable/airtable.constant";
import { Service } from "typedi";

@Service()
export class MainRepository {
    constructor(private airtableInstance: AirtableInstance) {
    }

    public async buildHierarchy(query: GetQuery): Promise<{ models: GetResponse<Model>[], parentChildModels: GetResponse<ModelModel>[] }> {
        // Get all data in models and model_model from airtable
        const [models, parentChildModels] = await Promise.all([
            this.airtableInstance.get<Model>(AIRTABLE_NAME.MODEL, {
                fields: ['number'],
                maxRecords: query.size
            }),
            this.airtableInstance.get<ModelModel>(AIRTABLE_NAME.MODEL_MODEL, {
                fields: ['number', 'parent_number']
            }),
        ]);

        return {
            models,
            parentChildModels
        }
    }

    public async getDrawing(query: GetQuery): Promise<{
        drawings: GetResponse<DrawingModel>[], models: GetResponse<Model>[]
    }> {
        // Get all data in drawings and model from airtable
        // model_model_number is a lookup field
        const [drawings, models] = await Promise.all([
            this.airtableInstance.get<DrawingModel>(AIRTABLE_NAME.DRAWINGS, {
                fields: ['name', 'model_model_number'],
                maxRecords: query.size
            }),
            this.airtableInstance.get<Model>(AIRTABLE_NAME.MODEL, {
                fields: ['number']
            })
        ]);
        return {
            drawings,
            models
        }
    }

    public async getServicePlanner(query: GetQuery): Promise<{ services: GetResponse<ServiceModel>[] }> {
        const services = await this.airtableInstance.get<ServiceModel>(AIRTABLE_NAME.SERVICES, {
            fields: ['name', 'calendar_interval', 'calendar_interval_unit', 'running_hours_interval'],
            maxRecords: query.size
        });
        return {
            services
        }
    }
}
