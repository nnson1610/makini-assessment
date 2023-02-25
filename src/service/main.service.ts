import { Model } from '../model/model.model';
import { GetDrawingResponse, GetQuery, GetHierarchyResponse, GetServicePlannerResponse, GetServicePlannerQuery } from "../common/interface";
import { MainRepository } from "../repository/main.repository";
import { IntervalUnit } from '../common/enum';
import {
    addDays,
    addHours,
    addMonths,
    addWeeks,
    addYears,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from 'date-fns';
import { Service } from "typedi";
import { GetResponse } from '../airtable/airtable.interface';
import { ModelModel } from '../model/model_model.model';
import { ServiceModel } from '../model/service.model';

@Service()
export class MainService {
    constructor(private mainRepository: MainRepository) { }
    // Output models in a tree structure, based on their parent-child relations
    public async buildHierarchy(query: GetQuery): Promise<GetHierarchyResponse<Partial<Model>>[]> {
        let hierarchy = {};
        // Get all data in models and model_model from airtable
        const { models, parentChildModels } = await this.mainRepository.buildHierarchy(query);

        // Map models to a object
        models.forEach((item: GetResponse<Model>) => {
            hierarchy[item.recordId] = item;
        });

        // Iterate through parentChildModels and add children to parent objects
        parentChildModels.forEach((item: GetResponse<ModelModel>) => {
            const parent = hierarchy[item.data.parent_number[0]];
            const child = hierarchy[item.data.number[0]];
            if (parent && child) {
                parent.children = parent.children || [];
                parent.children.push(child);
            }
        });

        // Return an array
        return Object.values(hierarchy);
    }

    // List of drawings and page to view models assigned to a drawing
    public async getDrawing(query: GetQuery): Promise<GetDrawingResponse[]> {
        // Get all data in drawings and model from airtable
        const { models, drawings } = await this.mainRepository.getDrawing(query);

        // Returns a map of models
        const modelsMap = models.reduce((map: { [x: string]: any; }, model: GetResponse<Model>) => {
            map[model.recordId] = model.data.number || "";
            return map;
        }, {});

        // Manipulate response data
        return drawings.map((drawing: any) => ({
            recordId: drawing.recordId,
            data: {
                name: drawing.data.name,
                model_number: Array.from(new Set(drawing.data.model_model_number)).map(
                    (item: string) => modelsMap[item] || ""
                )
            }
        }));
    }

    public getServicePlannerEndDate(startDate: Date, interval: number, intervalUnit?: IntervalUnit) {
        if (!startDate || !intervalUnit || isNaN(interval)) {
            return null;
        }
        switch (intervalUnit) {
            case IntervalUnit.HOUR:
                return addHours(startDate, interval);
            case IntervalUnit.DAY:
                return startOfDay(addDays(startDate, interval));
            case IntervalUnit.WEEK:
                return startOfWeek(addWeeks(startDate, interval));
            case IntervalUnit.MONTH:
                return startOfMonth(addMonths(startDate, interval));
            case IntervalUnit.YEAR:
                return startOfYear(addYears(startDate, interval));
            default:
                return null;
        }
    }

    // Display list of dates when services can be done based on schedule in DB and current date as starting point
    public async getServicePlanner(query: GetServicePlannerQuery): Promise<GetServicePlannerResponse[]> {
        // Get all data in services from airtable
        const { services } = await this.mainRepository.getServicePlanner({
            size: query.size
        });

        const startDate = parseISO(query.startDate || new Date().toISOString());
        return services.map((service: GetResponse<ServiceModel>) => {
            const { calendar_interval, calendar_interval_unit, running_hours_interval } = service.data;
            const endDate = this.getServicePlannerEndDate(startDate, Number(calendar_interval || running_hours_interval), running_hours_interval ? IntervalUnit.HOUR : calendar_interval_unit);
            return {
                recordId: service.recordId,
                data: {
                    name: service.data.name,
                    startDate: startDate.toISOString(),
                    endDate: endDate?.toISOString()
                }
            }
        })
    }
}
