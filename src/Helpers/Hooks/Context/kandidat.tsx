import { IKandidat } from "Helpers/Interface/Kandidat";
import { ReactElement, createContext, useState } from "react";

interface IKandidatContext {
  kandidatDetail: IKandidat;
  setKandidatDetail: (kandidat: IKandidat) => void;
  kandidat: IKandidat[];
  setKandidat: (kandidat: IKandidat[]) => void;
}

export const KandidatContext = createContext<IKandidatContext>({
  kandidatDetail: {
    id: 0,
    name: "",
    status: "",
    nik: "",
    age: 0,
    education: "",
    weight: 0,
    height: 0,
    handphone: "",
    occupation: "",
    maritalStatus: "",
    gender: "",
    email: "",
    registrationId: 0,
    religion: "",
    bloodType: "",
    rhesusType: "",
    placeOfBirth: "",
    photo: "",
    birthDate: new Date(),
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setKandidatDetail: (kandidat: IKandidat) => {},
  kandidat: [],
  setKandidat: (kandidat: IKandidat[]) => {},
});

export const KandidatProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [kandidatDetail, setKandidatDetail] = useState<IKandidat>({
    id: 0,
    name: "",
    status: "",
    nik: "",
    age: 0,
    education: "",
    weight: 0,
    height: 0,
    handphone: "",
    occupation: "",
    maritalStatus: "",
    gender: "",
    email: "",
    registrationId: 0,
    religion: "",
    bloodType: "",
    rhesusType: "",
    placeOfBirth: "",
    photo: "",
    birthDate: new Date(),
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [kandidat, setKandidat] = useState<IKandidat[]>([]);

  return (
    <KandidatContext.Provider
      value={{ kandidat, setKandidat, kandidatDetail, setKandidatDetail }}
    >
      {children}
    </KandidatContext.Provider>
  );
};
