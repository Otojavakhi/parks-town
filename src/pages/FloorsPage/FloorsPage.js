import "./FloorsPage.css";
import buildingImg from "../../utils/png/buildingImg.png";
import { MainUseContext } from "../../context/MainContext";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { useState } from "react";

export default function FloorsPage() {
  // const { build } = useParams();
  const { building } = useLoaderData();

  const [remainingApartments, setRemainingApartments] = useState(null);
  const [floor, setFloor] = useState(null);
  // sets hovered apartment to true for conditional rendering
  const [isHovered, setIsHovered] = useState(false);
  // sets coordinates on mouse cursor when hover it on element
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  // if (isLoading) return <p>loading...</p>;

  // sets mouse cursor coordinates
  const onMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    setCursorPosition({ x, y });
  };

  // founds hovered apartment
  const floorFounder = (datasetFloor) => {
    const remainingApartments = building
      .find((floor) => datasetFloor === floor.floor)
      ?.apartments.filter((apartment) => apartment.sold === false).length;

    console.log(remainingApartments);

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
        <p>search{remainingApartments}</p>
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
          {building.map((floor, i) => {
            return (
              <polygon
                className="default-poly-fill"
                key={floor.floor}
                points={floor.polypoints}
                data-floor={`floor-${i + 1}`}
              ></polygon>
            );
          })}
        </svg>
        <img src={buildingImg} alt="შენობა-1" />
      </div>
    </div>
  );
}

export const buildingLoader = async ({ params }) => {
  const { build } = params;

  const colRef = collection(db, `${build}`);
  const res = await getDocs(colRef);

  const building = res.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return { building };
};
