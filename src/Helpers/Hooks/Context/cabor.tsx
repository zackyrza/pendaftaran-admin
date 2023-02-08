import { ICabor } from "Helpers/Interface/Cabor";
import { ReactElement, createContext, useState } from "react";

interface ICaborContext {
  cabor: ICabor[];
  setCabor: (cabor: ICabor[]) => void;
  caborDetail: ICabor;
  setCaborDetail: (cabor: ICabor) => void;
}

export const CaborContext = createContext<ICaborContext>({
  cabor: [],
  setCabor: (cabor: ICabor[]) => {},
  caborDetail: {
    id: 0,
    name: "",
    imageUrl: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setCaborDetail: (cabor: ICabor) => {},
});

export const CaborProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [cabor, setCabor] = useState<ICabor[]>([]);
  const [caborDetail, setCaborDetail] = useState<ICabor>({
    id: 0,
    name: "",
    imageUrl: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <CaborContext.Provider
      value={{ cabor, setCabor, caborDetail, setCaborDetail }}
    >
      {children}
    </CaborContext.Provider>
  );
};
