import "./FloorsPage.css";
import { MainUseContext } from "../../context/MainContext";
import { useLoaderData, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "../../FirebaseConfig";
import { useState } from "react";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner/Spinner.js";
import { FloorsError } from "./FloorsError";
import { getDownloadURL, ref } from "firebase/storage";
import { Search } from "../../components/Search/Search";

export default function FloorsPage() {
  const { building } = useLoaderData();

  const { isLoading, setIsLoading, imgUrl, setImgUrl, setBuildingData } =
    MainUseContext();

  const [remainingApartments, setRemainingApartments] = useState(null);
  const [floor, setFloor] = useState(null);
  // sets hovered apartment to true for conditional rendering
  const [isHovered, setIsHovered] = useState(false);
  // sets coordinates on mouse cursor when hover it on element
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    
    setBuildingData(building);

    const imageUrl = building.buildingImg;
    const storageRef = ref(storage, imageUrl);
    getDownloadURL(storageRef)
      .then((url) => {
        setImgUrl(url);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setIsLoading(false);
      });
  }, [setIsLoading, setImgUrl, building.buildingImg]);
  // sets mouse cursor coordinates
  const onMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    setCursorPosition({ x, y });
  };

  // founds hovered apartment
  const floorFounder = (datasetFloor) => {
    const remainingApartments = building.floors
      .find((floor) => datasetFloor === floor.floor)
      ?.apartments.filter((apartment) => apartment.sold === false).length;

    // console.log(remainingApartments);

    setRemainingApartments(remainingApartments);
    setFloor(datasetFloor);
  };

  // shows floor-info when mouse over the element
  const handleMouseOver = (e) => {
    e.target.classList.add("poly-fill");

    if (!e.target.hasAttribute("data-floor")) return;

    const datasetFloor = e.target.dataset.floor;

    floorFounder(datasetFloor);
    setIsHovered(true);

    window.addEventListener("mousemove", onMouseMove);
  };

  // removes floor-info when mouseOut on element
  const handleMouseOut = (e) => {
    e.target.classList.remove("poly-fill");
    setIsHovered(false);
    window.removeEventListener("mousemove", onMouseMove);
  };

  // navigates current floor when floor(polygon) element is clicked

  const handleClickFloor = (e) => {
    e.target.classList.add("poly-fill");

    if (!e.target.hasAttribute("data-floor")) return;

    const datasetFloor = e.target.dataset.floor;

    floorFounder(datasetFloor);
    navigate(datasetFloor);
  };

  // checks if building is false shows Error page on UI.
  if (!building) return <FloorsError />;

  if (isLoading)
    return (
      <div className="isloading">
        <Spinner />
      </div>
    );

  return (
    <div className="main-content">
      <div className="search-layout">
        <Search />
      </div>
      <div className="main-right-building">
        <svg
          onClick={handleClickFloor}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          id="b-svg-container"
          viewBox="0 0 803 566"
          preserveAspectRatio="none"
        >
          {building.floors.map((floor) => {
            return (
              <polygon
                className="default-poly-fill"
                key={floor.floor}
                points={floor.floorPolypoints}
                data-floor={floor.floor}
              ></polygon>
            );
          })}
        </svg>
        <img src={imgUrl} alt="შენობა-1" />
      </div>
      <div>
        {isHovered && (
          <div
            className={`floor-info ${isHovered ? "active" : ""}`}
            style={{
              top: cursorPosition.y + -15 + "px",
              left: cursorPosition.x - 220 + "px",
            }}
          >
            <p>floor: {floor}</p>
            <p>Remaining Apartments: {remainingApartments}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const buildingLoader = async ({ params }) => {
  try {
    const { build } = params;

    const online = window.navigator.onLine;

    if (!online) {
      throw new Error("Internet connection not available");
    }

    const colRef = collection(db, "buildings");

    const q = query(colRef, where("building", "==", build));
    const snapshot = await getDocs(q);

    // checks if data is arrived otherwise throws an error.
    if (snapshot.empty) throw Error("Something went wrong!");

    let building = {};
    snapshot.docs.forEach((doc) => {
      building = { ...doc.data() };
    });

    return { building };
  } catch (error) {
    if (error.message === "Internet connection not available")
      throw new Error("Check Network Connection...");

    throw new Error("Building doesn't exists!");
  }
};
