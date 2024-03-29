import "./Building.css";
import leaves from "../../utils/png/leaves-scaled.webp";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import chooseBuilding from "../../utils/png/choose-building.png";
import { db } from "../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { BuildingError } from "./BuildingError";
import { ImHome } from "react-icons/im";
import { BsFillBuildingsFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { MainUseContext } from "../../context/MainContext";
export const Buildings = () => {
  const { setChoosenBuilding } = MainUseContext();
  const [buildingCoordinates, setBuildingCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [leftApartments, setLeftApartments] = useState(null);
  const [allAppartments, setAllApartments] = useState(null);
  const buildingsData = useLoaderData();
  // console.log(buildingCollection);
  const navigate = useNavigate();

  // console.log([...buildingCollection]);
  const buildingFinder = (e) => {
    const datasetBuilding = e.target.dataset.building;
    setChoosenBuilding(datasetBuilding);
    navigate(datasetBuilding);
  };

  const handleMouseOver = (e) => {
    if (!e.target.hasAttribute("data-building")) return;

    // takes data-apartment attribute from polygon element and finds exact apartment
    const datasetBuilding = e.target.getAttribute("data-building");

    // Finds hovered building
    const foundBuilding = buildingsData.find(
      (building) => building.building === datasetBuilding
    );

    if (!foundBuilding) return <BuildingError />;

    // Calculates all apartments on hovered building
    const allAppartments = foundBuilding.floors.flatMap(
      (floor) => floor.apartments
    ).length;

    setAllApartments(allAppartments);

    // Calculates left apartments on hovered building
    const leftApartments = foundBuilding.floors
      .flatMap((floor) => floor.apartments)
      .filter((apartment) => apartment?.sold !== true).length;

    setLeftApartments(leftApartments);

    if (
      !hoveredBuilding ||
      hoveredBuilding.building !== foundBuilding.building
    ) {
      setHoveredBuilding(foundBuilding);
    }
    const buildingContainer = e.currentTarget.parentNode;
    const containerRect = buildingContainer.getBoundingClientRect();

    // coordinates hovered element's position
    const polygon = e.target;
    const polygonRect = polygon.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const centerX =
      polygonRect.left - containerRect.left + polygonRect.width / 2;
    const centerY = polygonRect.top - containerTop;

    setBuildingCoordinates({ x: centerX, y: centerY });
  };

  const handleMouseOut = () => {
    setHoveredBuilding(null);
  };

  return (
    <div className="choose-building-container">
      <div className="building-container">
        <svg
          id="c-b-svg-container"
          viewBox="0 0 803 566"
          preserveAspectRatio="none"
          onClick={buildingFinder}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {buildingsData.map((building) => {
            return (
              <polygon
                key={building.id}
                data-building={building.building}
                className="poly-fill"
                points={building.buildingPolypoints}
              ></polygon>
            );
          })}
        </svg>

        <img src={chooseBuilding} alt="choose-building" />
        {hoveredBuilding && (
          <div
            className="coord-div"
            style={{
              left: buildingCoordinates.x,
              top: buildingCoordinates.y - 10,
            }}
          >
            <span className="building-poly-text">
              <BsFillBuildingsFill className="choose-building-icons" />
              შენობა {hoveredBuilding.building.slice(-1)}
            </span>
            <span className="building-poly-text">
              <ImHome className="choose-building-icons" />
              ბინები: {allAppartments}
            </span>
            <span className="building-poly-text">
              <FaKey className="choose-building-icons" />
              დარჩენილი ბინები: {leftApartments}
            </span>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export const buildingsCollectionLoader = async () => {
  try {
    const online = window.navigator.onLine;

    if (!online) {
      throw new Error("Internet connection not available");
    }

    const colRef = collection(db, "buildings");
    const snapshot = await getDocs(colRef);

    let buildingsData = [];

    if (!snapshot.empty) {
      buildingsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    }
    if (!buildingsData) throw Error("Building not found!");

    return buildingsData;
  } catch (error) {
    if (error.message === "Internet connection not available")
      throw new Error("Check Network Connection...");

    throw new Error("Building not found!");
  }
};
