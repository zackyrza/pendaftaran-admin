export interface ICabor {
    id: number;
    name: string;
    imageUrl: string;
    noteUrl: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICaborPost {
    name: string;
    imageUrl: string;
    noteUrl: string;
}