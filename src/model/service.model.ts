import { IntervalUnit } from "../common/enum";
export class ServiceModel {
    name: string;
    calendar_interval?: number;
    calendar_interval_unit?: IntervalUnit;
    running_hours_interval?: number;
    [key: string]: any;
}