import "./Building.css";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import chooseBuilding from "../../utils/png/choose-building.png";
import { db } from "../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";

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

    console.log(e.target.getAttribute("data-building"));
    // takes data-apartment attribute from polygon element and finds exact apartment
    const datasetBuilding = e.target.getAttribute("data-building");

    const foundBuilding = buildingsData.find(
      (building) => building.building === datasetBuilding
    );
    console.log(foundBuilding);
    // if apartment doesn't find, when it's sold just returns. avoid undefined error.
    if (!foundBuilding) return;
    const allAppartments = foundBuilding.floors
      .map((floor) => floor.apartments)
      .flat().length;
    setAllApartments(allAppartments);

    const leftApartments = foundBuilding.floors
      .map((floor) => floor.apartments)
      .flat()
      .filter((apartment) => apartment.sold !== true).length;
    console.log("apartments", leftApartments);
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
              {`სულ ბინები: ${allAppartments}`}
            </span>
            <span className="apartment-poly-text">
              {`დარჩენილი ბინები: ${leftApartments}`}
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
    const colRef = collection(db, "buildings");
    const snapshot = await getDocs(colRef);

    let buildingsData = [];

    if (!snapshot.empty) {
      buildingsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log("buuildings", buildingsData);
    }

    console.log(buildingsData);
    return buildingsData;
  } catch (error) {
    // catch (error) {
    //   if (error.message === "Internet connection not available") {
    //     throw new Error("Check Network Connection...");
    //   } else {
    //     throw new Error("Page doesnt exists!");
    //   }
    // }
    console.log(error.message);
  }
};
