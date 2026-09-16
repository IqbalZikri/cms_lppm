export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    length: number;
    map: any;
}

