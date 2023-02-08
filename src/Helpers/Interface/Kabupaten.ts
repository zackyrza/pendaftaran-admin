export interface IKabupaten {
    id: number;
    name: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IKabupatenPost {
    name: string;
}