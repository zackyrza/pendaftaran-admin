import { IGender } from "Helpers/Interface/Gender";
import { ReactElement, createContext, useState } from "react";

interface IGenderContext {
  gender: IGender[];
  setGender: (gender: IGender[]) => void;
  genderDetail: IGender;
  setGenderDetail: (gender: IGender) => void;
}

export const GenderContext = createContext<IGenderContext>({
  gender: [],
  setGender: (gender: IGender[]) => {},
  genderDetail: {
    id: 0,
    name: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setGenderDetail: (gender: IGender) => {},
});

export const GenderProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [gender, setGender] = useState<IGender[]>([]);
  const [genderDetail, setGenderDetail] = useState<IGender>({
    id: 0,
    name: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <GenderContext.Provider
      value={{ gender, setGender, genderDetail, setGenderDetail }}
    >
      {children}
    </GenderContext.Provider>
  );
};
