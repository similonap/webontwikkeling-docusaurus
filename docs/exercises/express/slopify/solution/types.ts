export interface Song {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    credits: number;
    mp3: string;
    owned?: boolean;
    more_information: {
        publish_date: string;
        genre: string;
        type: string;
        youtube?: string;
    };
}

export interface User {
    credits: number;
    owned: Song[];
}


export type SortField = "title" | "owned" | "publish_date";
export type SortDirection = "asc" | "desc";