import "./App.css";
import { MainContextProvider } from "./context/MainContext";

// Router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

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
import { Buildings } from "./pages/Buildings/Buildings";
import { FloorsError } from "./pages/FloorsPage/FloorsError";

/////////////////////////////////////////

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="contact" element={<Contact />} />

      <Route path="choose-building" element={<FloorsLayout />}>
        <Route index element={<Buildings />} />
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
