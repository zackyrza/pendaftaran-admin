import { IKabupaten } from "Helpers/Interface/Kabupaten";
import { ReactElement, createContext, useState } from "react";

interface IKabupatenContext {
  kabupaten: IKabupaten[];
  setKabupaten: (kabupaten: IKabupaten[]) => void;
  kabupatenDetail: IKabupaten;
  setKabupatenDetail: (kabupaten: IKabupaten) => void;
}

export const KabupatenContext = createContext<IKabupatenContext>({
  kabupaten: [],
  setKabupaten: (kabupaten: IKabupaten[]) => {},
  kabupatenDetail: {
    id: 0,
    name: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setKabupatenDetail: (kabupaten: IKabupaten) => {},
});

export const KabupatenProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [kabupaten, setKabupaten] = useState<IKabupaten[]>([]);
  const [kabupatenDetail, setKabupatenDetail] = useState<IKabupaten>({
    id: 0,
    name: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <KabupatenContext.Provider
      value={{ kabupaten, setKabupaten, kabupatenDetail, setKabupatenDetail }}
    >
      {children}
    </KabupatenContext.Provider>
  );
};
