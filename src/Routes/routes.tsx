import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Error from "../Pages/Error";
import Kabupaten from "../Pages/Kabupaten";
import KabupatenForm from "../Pages/KabupatenForm";
import Cabor from "../Pages/Cabor";
import CaborForm from "../Pages/CaborForm";
import Login from "../Pages/Login";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
    children: [
      {
        path: "kabupaten",
        element: <Kabupaten />,
      },
      {
        path: "kabupaten/:id",
        element: <KabupatenForm />,
      },
      {
        path: "cabor",
        element: <Cabor />,
      },
      {
        path: "cabor/:id",
        element: <CaborForm />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default routes;
