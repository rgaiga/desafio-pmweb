export interface Pagination<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        count: number;
        totalPages: number;
        totalCount: number;
    };
}
