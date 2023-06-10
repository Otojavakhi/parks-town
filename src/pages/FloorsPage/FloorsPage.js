import "./FloorsPage.css";
import buildingImg from "../../utils/png/buildingImg.png";
import { MainUseContext } from "../../context/MainContext";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { useState } from "react";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner/Spinner.js";
import { FloorsError } from "./FloorsError";

export default function FloorsPage() {
  // const { build } = useParams();
  const { building } = useLoaderData();
  const { isLoading, setIsLoading, imgUrl, getImgUrl } = MainUseContext();

  const [remainingApartments, setRemainingApartments] = useState(null);
  const [floor, setFloor] = useState(null);
  // sets hovered apartment to true for conditional rendering
  const [isHovered, setIsHovered] = useState(false);
  // sets coordinates on mouse cursor when hover it on element
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  console.log("buildingggg", building);

  // sets loading to false when data is fetched and shows spinner on UI.
  // this setTimeOut is for testing spinner.
  // useEffect(() => {
  //   setIsLoading(true);
  //   setIsLoading(false);
  // }, [building]);

  useEffect(() => {
    setIsLoading(true);
    const imageUrl = building.buildingImg;
    getImgUrl(imageUrl).then(() => {
      setIsLoading(false);
    });
  }, []);
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
    console.log("dataset", datasetFloor);

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
      <div className="building-left-side">
        {isHovered && (
          <div
            className={`floor-info ${isHovered ? "active" : ""}`}
            style={{
              top: cursorPosition.y + -15 + "px",
              left: cursorPosition.x + 35 + "px",
            }}
          >
            <p>floor: {floor}</p>
            <p>Remaining Apartments: {remainingApartments}</p>
          </div>
        )}
        <p>search</p>
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
    </div>
  );
}

export const buildingLoader = async ({ params }) => {
  try {
    const { build } = params;
    console.log("params", build);

    const online = window.navigator.onLine;

    if (!online) {
      throw new Error("Internet connection not available");
    }

    // const colRef = collection(db, `${build}`);
    // console.log("colref", colRef);
    // const snapshot = await getDocs(colRef);
    // console.log(snapshot);

    // if (snapshot.empty) throw Error("Page doesn't exists!");

    // const building = snapshot.docs.map((doc) => ({
    //   ...doc.data(),
    //   id: doc.id,
    // }));
    // console.log("building", building);

    // return { building };

    const colRef = collection(db, "buildings");

    const q = query(colRef, where("building", "==", build));
    const snapshot = await getDocs(q);

    // checks if data is arrived otherwise throws an error.
    if (snapshot.empty) throw Error("Page doesn't exists!");

    let building = {};
    snapshot.docs.forEach((doc) => {
      building = { ...doc.data() };
    });

    return { building };
  } catch (error) {
    if (error.message === "Internet connection not available") {
      throw new Error("Check Network Connection...");
    } else {
      throw new Error("Page doesnt exists!");
    }
  }
};
