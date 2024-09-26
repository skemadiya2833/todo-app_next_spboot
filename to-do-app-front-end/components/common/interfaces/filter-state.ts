export interface FilterState {
    query: string;
    priority: null | string;
    sort: null | string;
    sortType: string;
    categoryId: null | string;
    status: null | string;
    overdues: boolean;
    page: number;
    date: {
        start: any,
        end: any,
    }
}