import { ModelResource } from "./model.resource.dto";

export class PaginatedResource<T> {
    data: Array<T>;
    meta: {
        page: number
        perPage: number
        total: number
        totalPages: number
    };

    constructor(resource: { data: T[], meta: { page: number, perPage: number, total: number, totalPages: number } }) {
        this.data = resource.data
        this.meta = resource.meta
    }
}