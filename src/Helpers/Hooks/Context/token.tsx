import { ReactElement, createContext, useState } from "react";

interface ITokenContext {
  token: string | null;
  setToken: (token: string) => void;
}

export const TokenContext = createContext<ITokenContext>({
  token: null,
  setToken: (token: string) => {},
});

export const TokenProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>("");

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
