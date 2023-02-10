import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Error from "../Pages/Error";
import Kabupaten from "../Pages/Kabupaten";
import KabupatenForm from "../Pages/KabupatenForm";
import Cabor from "../Pages/Cabor";
import CaborForm from "../Pages/CaborForm";
import Login from "../Pages/Login";
import Kategori from "Pages/Kategori";
import KategoriForm from "Pages/KategoriForm";
import Gender from "Pages/Gender";
import GenderForm from "Pages/GenderForm";
import User from "Pages/User";
import UserForm from "Pages/UserForm";
import Pendaftaran from "Pages/Pendaftaran";
import PendaftaranForm from "Pages/PendaftaranForm";
import Kandidat from "Pages/Kandidat";
import KandidatForm from "Pages/KandidatForm";
import Cetak from "Pages/Cetak";

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
      {
        path: "kategori",
        element: <Kategori />,
      },
      {
        path: "kategori/:id",
        element: <KategoriForm />,
      },
      {
        path: "gender",
        element: <Gender />,
      },
      {
        path: "gender/:id",
        element: <GenderForm />,
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "user/:id",
        element: <UserForm />,
      },
      {
        path: "pendaftaran",
        element: <Pendaftaran />,
      },
      {
        path: "pendaftaran/:id",
        element: <PendaftaranForm />,
      },
      {
        path: "kandidat",
        element: <Kandidat />,
      },
      {
        path: "kandidat/:id",
        element: <KandidatForm />,
      },
      {
        path: "cetak",
        element: <Cetak />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default routes;
