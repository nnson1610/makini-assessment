export interface GetQuery {
    size?: number;
}

export interface GetHierarchyResponse<T> {
    recordId: string;
    data: T;
    children: GetHierarchyResponse<T>[];
}

export interface GetDrawingResponse {
    recordId: string;
    data: {
        name: string;
        model_number: string[];
    };
}

export interface GetServicePlannerQuery extends GetQuery {
    startDate?: string;
}

export interface GetServicePlannerResponse {
    recordId: string;
    data: {
        name: string;
        startDate: string; // the date service starts
        endDate?: string;// the date service ends
    };
}