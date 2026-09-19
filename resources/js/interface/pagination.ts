export interface PaginationLink {
    url: string;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    from: number;
    current_page: number;
    last_page: number;
    first_page_url: string;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string;
    prev_page_url: string;
    path: string;
    per_page: number;
    to: number | null;
    length: number;
    map: any;
    total: number;
}
