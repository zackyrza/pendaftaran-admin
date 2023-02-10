import { IGender } from "./Gender";
import { IKabupaten } from "./Kabupaten";
import { IKandidat } from "./Kandidat";
import { IKategori } from "./Kategori";

export interface IPendaftaran {
    id: number;
    quantity: number,
    city?: IKabupaten,
    cityId: number,
    classId: number,
    class?: IKategori,
    email: string,
    sportGenderId: number,
    sportGender?: IGender,
    candidates?: IKandidat[];
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPendaftaranPost {
    quantity: number,
    cityId: number,
    classId: number,
    email: string,
    sportGenderId: number,
}