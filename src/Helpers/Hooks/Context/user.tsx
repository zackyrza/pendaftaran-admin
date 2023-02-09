import { IUser } from "Helpers/Interface/User";
import { ReactElement, createContext, useState } from "react";

interface IUserContext {
  user: IUser;
  setUser: (user: IUser) => void;
  users: IUser[];
  setUsers: (users: IUser[]) => void;
}

export const UserContext = createContext<IUserContext>({
  user: {
    id: 0,
    email: "",
    password: "",
    fullName: "",
    role: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setUser: (user: IUser) => {},
  users: [],
  setUsers: (users: IUser[]) => {},
});

export const UserProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser>({
    id: 0,
    email: "",
    password: "",
    fullName: "",
    role: "",
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [users, setUsers] = useState<IUser[]>([]);

  return (
    <UserContext.Provider value={{ user, setUser, users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};
