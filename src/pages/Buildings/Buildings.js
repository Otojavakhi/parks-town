import "./Building.css";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import chooseBuilding from "../../utils/png/choose-building.png";
import { db } from "../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { BuildingError } from "./BuildingError";

export const Buildings = () => {
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
      .filter((apartment) => apartment.sold !== true).length;

    setLeftApartments(leftApartments);

    if (
      !hoveredBuilding ||
      hoveredBuilding.building !== foundBuilding.building
    ) {
      setHoveredBuilding(foundBuilding);
    }
    // coordinates hovered element's position
    const polygon = e.target;
    const bbox = polygon.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y;

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
              left: buildingCoordinates.x + 5,
              top: buildingCoordinates.y - 70,
            }}
          >
            <span className="apartment-poly-text">
              {hoveredBuilding.building}
            </span>
            <span className="apartment-poly-text">
              {`apartments: ${allAppartments}`}
            </span>
            <span className="apartment-poly-text">
              {`left apartments: ${leftApartments}`}
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
