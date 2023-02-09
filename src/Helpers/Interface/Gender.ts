export interface IGender {
    id: number;
    name: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGenderPost {
    name: string;
}