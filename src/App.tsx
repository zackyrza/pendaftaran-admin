import React from "react";
import Routers from "./Routes";
import { TokenProvider } from "Helpers/Hooks/Context/token";
import { UserProvider } from "Helpers/Hooks/Context/user";

function App() {
  return (
    <TokenProvider>
      <UserProvider>
        <Routers />
      </UserProvider>
    </TokenProvider>
  );
}

export default App;
