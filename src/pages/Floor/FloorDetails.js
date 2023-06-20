import "./FloorDetail.css";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { MainUseContext } from "../../context/MainContext";
import { storage } from "../../FirebaseConfig";
import { useEffect } from "react";
import FloorError from "./FloorError";
import { useState } from "react";
import { Spinner } from "../../components/Spinner/Spinner.js";
import { buildingLoader } from "../FloorsPage/FloorsPage";
import { getDownloadURL, ref } from "firebase/storage";
import { ImHome } from "react-icons/im";

export const FloorDetails = () => {
  const { fl } = useParams();
  // loads data from Loader Function
  const floor = useLoaderData();
  // loads images from firebase
  const { setIsLoading } = MainUseContext();

  const navigate = useNavigate();

  // shows apartment's number and apartment's square when hover it
  const [hoveredApartment, setHoveredApartment] = useState(null);
  const [apartmentCoordinates, setApartmentCoordinates] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setLoading] = useState(true);

  // loads apartment's images from firebase
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      const imageUrl = floor.floorImg;
      const storageRef = ref(storage, imageUrl);
      const url = await getDownloadURL(storageRef);
      setImgUrl(url);
      setLoading(false);
    };

    loadImage();
  }, [setIsLoading, floor.floorImg]);

  if (!floor) return <FloorError />;

  // shows apartments details when hover on each polygon element
  const handleMouseOver = (e) => {
    if (!e.target.hasAttribute("data-apartment")) return;

    // takes data-apartment attribute from polygon element and finds exact apartment
    const datasetApartment = e.target.getAttribute("data-apartment");

    const foundApartment = floor.apartments.find(
      (apartment) => apartment.apartment === datasetApartment
    );
    // if apartment doesn't find, when it's sold just returns. avoid undefined error.
    if (!foundApartment) return;

    if (
      !hoveredApartment ||
      hoveredApartment.apartment !== foundApartment.apartment
    ) {
      setHoveredApartment(foundApartment);
    }

    // coordinates hovered element's position
    const apartmentContainer = e.currentTarget.parentNode;
    const containerRect = apartmentContainer.getBoundingClientRect();

    // coordinates hovered element's position
    const polygon = e.target;
    const polygonRect = polygon.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const centerX =
      polygonRect.left - containerRect.left + polygonRect.width / 2;
    const centerY = polygonRect.top - containerTop;

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
          {floor.apartments.map((apartment) => (
            <polygon
              className={`apartment-poly-fill ${
                apartment.sold ? "sold-apartment" : ""
              }`}
              key={apartment.apartment}
              points={apartment.apartmentPolypoints}
              data-apartment={apartment.apartment}
            />
          ))}
        </svg>
        <img src={imgUrl} alt={`სართული-${fl}`} />
        {hoveredApartment && (
          <div
            className={`apartment-coord-div ${
              hoveredApartment.sold ? "sold-coord-div" : ""
            }`}
            style={{
              left: apartmentCoordinates?.x - 50,
              top: apartmentCoordinates?.y - 90,
            }}
          >
            {hoveredApartment.sold ? (
              <span className="apartment-poly-text">
                <ImHome className="apartment-info-icon" />
                <span>sold</span>
              </span>
            ) : (
              <>
                <span className="apartment-poly-text">
                  <ImHome className="apartment-info-icon" />
                  <span>ბინა {hoveredApartment.apartment.slice(-1)}</span>
                </span>
                <span className="apartment-poly-text">{`${hoveredApartment.square} m2`}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Loads floor data from firebase
export const floorDetailLoader = async ({ params }) => {
  try {
    const { fl } = params;

    const online = window.navigator.onLine;

    if (!online) {
      throw new Error("Internet connection not available");
    }

    const { building } = await buildingLoader({ params });

    const floor = building.floors.find((floor) => floor.floor === fl);

    if (!floor) {
      throw new Error("Floor doesn't exist!");
    }
    return floor;
  } catch (error) {
    const errorMessage =
      error.message === "Internet connection not available"
        ? "Check Network Connection..."
        : "Floor doesn't exists!";
    throw Error(errorMessage);
  }
};
