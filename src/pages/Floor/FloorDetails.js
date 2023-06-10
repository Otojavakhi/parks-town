import "./FloorDetail.css";
import {
  Link,
  Navigate,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import { MainUseContext } from "../../context/MainContext";
import { query, where, collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { useEffect } from "react";
import FloorError from "./FloorError";
import { useState } from "react";
import { Spinner } from "../../components/Spinner/Spinner.js";
import { buildingLoader } from "../FloorsPage/FloorsPage";
import { getDownloadURL } from "firebase/storage";

export const FloorDetails = () => {
  const { fl } = useParams();
  // loads data from Loader Function
  const floor = useLoaderData();
  // loads images from firebase
  const { getImgUrl, imgUrl, isLoading, setIsLoading } = MainUseContext();

  const navigate = useNavigate();

  // shows apartment's number and apartment's square when hover it
  const [hoveredApartment, setHoveredApartment] = useState(null);
  const [apartmentCoordinates, setApartmentCoordinates] = useState({
    x: 0,
    y: 0,
  });

  // loads apartment's images from firebase
  useEffect(() => {
    setIsLoading(true);
    const imageUrl = floor.floorImg;
    getImgUrl(imageUrl).then(() => {
      setIsLoading(false);
    });
  }, []);

  if (!floor) return <FloorError />;

  // shows apartments details when hover on each polygon element
  const handleMouseOver = (e) => {
    if (!e.target.hasAttribute("data-apartment")) return;

    console.log(e.target.getAttribute("data-apartment"));
    // takes data-apartment attribute from polygon element and finds exact apartment
    const datasetApartment = e.target.getAttribute("data-apartment");

    const foundApartment = floor.apartments.find(
      (apartment) =>
        apartment.apartment === datasetApartment && apartment.sold !== true
    );
    console.log(foundApartment);
    // if apartment doesn't find, when it's sold just returns. avoid undefined error.
    if (!foundApartment) return;

    if (
      !hoveredApartment ||
      hoveredApartment.apartment !== foundApartment.apartment
    ) {
      setHoveredApartment(foundApartment);
    }

    // coordinates hovered element's position
    const polygon = e.target;
    const bbox = polygon.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y;

    setApartmentCoordinates({ x: centerX, y: centerY });
  };

  ////////////////////
  const handleMouseOut = () => {
    setHoveredApartment(null);
  };

  // Navigates clicked Apartment
  const handleClickApartment = (e) => {
    if (!e.target.hasAttribute("data-apartment")) return;

    const dataApartment = e.target.dataset.apartment;

    // Founds clicked polygon(apartment)
    const foundApartment = floor.apartments.find(
      (apartment) => apartment.apartment === dataApartment
    );
    // prevents navigating on the sold apartment
    if (foundApartment.sold) return;

    // navigates to apartment's page. details UI
    navigate(foundApartment.apartment);
  };

  if (isLoading)
    return (
      <div className="isloading">
        <Spinner />
      </div>
    );

  return (
    <div className="floor-details">
      <div className="floor-container">
        <svg
          id="f-svg-container"
          viewBox="0 0 955 577"
          preserveAspectRatio="none"
          onClick={handleClickApartment}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {floor.apartments.map((apartment) => {
            return (
              <polygon
                className={`poly-fill ${
                  apartment.sold ? "sold-apartment" : ""
                }`}
                key={apartment.apartment}
                points={apartment.apartmentPolypoints}
                data-apartment={apartment.apartment}
              ></polygon>
            );
          })}
        </svg>
        <img src={imgUrl} alt={`სართული-${fl}`} />
        {hoveredApartment && (
          <div
            className="coord-div"
            style={{
              left: apartmentCoordinates.x + 5,
              top: apartmentCoordinates.y - 50,
            }}
          >
            <span className="apartment-poly-text">
              {hoveredApartment.apartment}
            </span>
            <span className="apartment-poly-text">
              {`${hoveredApartment.square} m2`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
// const getFloorImageUrl = async (urlLink) => {
//   const { getImgUrl } = MainUseContext();
//   const imageUrl = await getImgUrl(urlLink); // Example path to the image file in Firebase Storage
//   return imageUrl;
// };

// Loads floor data from firebase
export const floorDetailLoader = async ({ params }) => {
  try {
    const { fl, build } = params;

    const { building } = await buildingLoader({ params });

    const floor = building.floors.find((floor) => floor.floor === fl);
    console.log("fllll", floor);

    return floor;
  } catch (error) {
    const errorMessage =
      error.message === "Internet connection not available"
        ? "Check Network Connection..."
        : "Page doesnt exists!";
    throw Error(errorMessage);
  }
};

// const colRef = collection(db, `${build}`);

// const q = query(colRef, where("floor", "==", fl));
// // checks users Network online status
// const online = window.navigator.onLine;

// if (!online) {
//   throw new Error("Internet connection not available");
// }

// const snapshot = await getDocs(q);

// // checks if data is arrived otherwise throws an error.
// if (snapshot.empty) throw Error("Page doesn't exists!");

// let floor = {};
// snapshot.docs.forEach((doc) => {
//   floor = { ...doc.data() };
// });

// return floor;
