import { IPendaftaran } from "Helpers/Interface/Pendaftaran";
import { ReactElement, createContext, useState } from "react";

interface IPendaftaranContext {
  pendaftaran: IPendaftaran[];
  setPendaftaran: (pendaftaran: IPendaftaran[]) => void;
  pendaftaranDetail: IPendaftaran;
  setPendaftaranDetail: (pendaftaran: IPendaftaran) => void;
}

export const PendaftaranContext = createContext<IPendaftaranContext>({
  pendaftaran: [],
  setPendaftaran: (pendaftaran: IPendaftaran[]) => {},
  pendaftaranDetail: {
    id: 0,
    cityId: 0,
    classId: 0,
    sportGenderId: 0,
    email: "",
    quantity: 0,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setPendaftaranDetail: (pendaftaran: IPendaftaran) => {},
});

export const PendaftaranProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [pendaftaran, setPendaftaran] = useState<IPendaftaran[]>([]);
  const [pendaftaranDetail, setPendaftaranDetail] = useState<IPendaftaran>({
    id: 0,
    cityId: 0,
    classId: 0,
    sportGenderId: 0,
    email: "",
    quantity: 0,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <PendaftaranContext.Provider
      value={{
        pendaftaran,
        setPendaftaran,
        pendaftaranDetail,
        setPendaftaranDetail,
      }}
    >
      {children}
    </PendaftaranContext.Provider>
  );
};
