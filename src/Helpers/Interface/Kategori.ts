import { ICabor } from "./Cabor";

export interface IKategori {
    id: number;
    name: string;
    sportId: number;
    sport?: ICabor;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IKategoriPost {
    name: string;
    sportId: number;
}