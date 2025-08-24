export interface banner {
    id: number;
    summary: string;
    thumbnail: string;
    title: string;
}

export interface blog {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    showCount: number;
    createdAt: Date;
    updatedAt: Date;
}