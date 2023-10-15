import { MainContextProvider } from "./context/MainContext";
import "./variables.css";
// Router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
// layouts
import RootLayout from "./layouts/RootLayout";
import FloorsLayout from "./layouts/FloorsLayout";

// pages
import FloorsPage, { buildingLoader } from "./pages/FloorsPage/FloorsPage";
import { floorDetailLoader, FloorDetails } from "./pages/Floor/FloorDetails";
import { Home } from "./pages/Home/Home";
import {
  ApartmentDetails,
  apartmentDetailsLoader,
} from "./pages/Apartment/ApartmentDetails";
import { Contact } from "./pages/Contact/Contact";

// errors
import FloorError from "./pages/Floor/FloorError";
import ApartmentError from "./pages/Apartment/ApartmentError";
import NotFound from "./pages/NotFound";
import {
  Buildings,
  buildingsCollectionLoader,
} from "./pages/Buildings/Buildings";
import { FloorsError } from "./pages/FloorsPage/FloorsError";
import { BuildingError } from "./pages/Buildings/BuildingError";
import AdminSignIn from "./pages/Admin/AdminSignIn";
import AdminPanel from "./pages/Admin/AdminPanel/AdminPanel";
import SignInError from "./pages/Admin/SignInError";

/////////////////////////////////////////

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="contact" element={<Contact />} />
      <Route path="admin" element={<AdminSignIn />} />
      {/* <Route
        path="admin/admin-panel"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
        // errorElement={<SignInError />}
      /> */}

      <Route path="choose-building" element={<FloorsLayout />}>
        {/* <Route index element={<Buildings />} /> */}
        <Route
          index
          element={<Buildings />}
          loader={buildingsCollectionLoader}
          errorElement={<BuildingError />}
        />
        <Route
          path=":build"
          element={<FloorsPage />}
          loader={buildingLoader}
          errorElement={<FloorsError />}
        />
        <Route
          path=":build/:fl"
          element={<FloorDetails />}
          loader={floorDetailLoader}
          errorElement={<FloorError />}
        />
        <Route
          path=":build/:fl/:apart"
          element={<ApartmentDetails />}
          loader={apartmentDetailsLoader}
          errorElement={<ApartmentError />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <MainContextProvider>
      <RouterProvider router={router} />
    </MainContextProvider>
  );
}

export default App;
