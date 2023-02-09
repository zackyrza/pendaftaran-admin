import { IKategori } from "Helpers/Interface/Kategori";
import { ReactElement, createContext, useState } from "react";

interface IKategoriContext {
  kategori: IKategori[];
  setKategori: (kategori: IKategori[]) => void;
  kategoriDetail: IKategori;
  setKategoriDetail: (kategori: IKategori) => void;
}

export const KategoriContext = createContext<IKategoriContext>({
  kategori: [],
  setKategori: (kategori: IKategori[]) => {},
  kategoriDetail: {
    id: 0,
    name: "",
    sportId: 0,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setKategoriDetail: (kategori: IKategori) => {},
});

export const KategoriProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [kategori, setKategori] = useState<IKategori[]>([]);
  const [kategoriDetail, setKategoriDetail] = useState<IKategori>({
    id: 0,
    name: "",
    sportId: 0,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <KategoriContext.Provider
      value={{ kategori, setKategori, kategoriDetail, setKategoriDetail }}
    >
      {children}
    </KategoriContext.Provider>
  );
};
