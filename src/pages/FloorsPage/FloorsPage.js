import "./FloorsPage.css";
import leaves from "../../utils/png/leaves-scaled.webp";
import { MainUseContext } from "../../context/MainContext";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { getFirestore, doc } from "firebase/firestore";
import { db, storage } from "../../FirebaseConfig";
import { useState } from "react";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner/Spinner.js";
import { FloorsError } from "./FloorsError";
import { getDownloadURL, ref } from "firebase/storage";

import { Search } from "../../components/Search/Search";
import { ImHome } from "react-icons/im";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { useRef } from "react";
import { TfiClose } from "react-icons/tfi";
import { toHaveStyle } from "@testing-library/jest-dom/matchers";
import { AiFillCheckCircle } from "react-icons/ai";

export default function FloorsPage() {
  const { building } = useLoaderData();

  const {
    isLoading,
    setIsLoading,
    imgUrl,
    setImgUrl,
    setBuildingData,
    user,
    choosenBuilding,
  } = MainUseContext();

  const [successUpdate, setSuccessUpdate] = useState(false);
  const priceRef = useRef(null);
  const [updatedBtnClick, setUpdatedBtnClick] = useState(false);
  const [remainingApartments, setRemainingApartments] = useState(null);
  const [floor, setFloor] = useState(null);
  // sets hovered apartment to true for conditional rendering
  const [isHovered, setIsHovered] = useState(false);
  // sets coordinates on mouse cursor when hover it on element
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const navigate = useNavigate();

  const calculateFloorInfoPosition = () => {
    const cursorOffsetX = 20;
    const cursorOffsetY = 25;
    const floorInfoWidth = 165;
    const floorInfoHeight = 52;

    let floorInfoLeft = cursorPosition.x - floorInfoWidth / 2;
    let floorInfoTop = cursorPosition.y - cursorOffsetY;
    if (window.innerWidth <= 1024) {
      floorInfoLeft = cursorPosition.x - 150;
      floorInfoTop = cursorPosition.y - floorInfoHeight - cursorOffsetY + 55;
    }
    if (window.innerWidth >= 1024) {
      floorInfoLeft = cursorPosition.x - 190;
      floorInfoTop = cursorPosition.y - floorInfoHeight - cursorOffsetY + 50;
    }
    if (window.innerWidth >= 1224) {
      floorInfoLeft = cursorPosition.x - 220;
      floorInfoTop = cursorPosition.y - floorInfoHeight - cursorOffsetY + 40;
    }
    if (window.innerWidth >= 1448) {
      floorInfoLeft = cursorPosition.x - 220;
      floorInfoTop = cursorPosition.y - floorInfoHeight - cursorOffsetY + 50;
    }
    return {
      top: floorInfoTop + "px",
      left: floorInfoLeft + "px",
    };
  };

  useEffect(() => {
    setIsLoading(true);

    setBuildingData(building);

    const imageUrl = building.buildingImg;
    const storageRef = ref(storage, imageUrl);
    // console.log("choosenBuilding", choosenBuilding);
    getDownloadURL(storageRef)
      .then((url) => {
        setImgUrl(url);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setIsLoading(false);
      });
    console.log(imgUrl);
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

    if (!e.target.hasAttribute("data-floor")) console.log("has not attribute");
    if (!e.target.hasAttribute("data-floor")) return;
    console.log(e.target);

    const datasetFloor = e.target.dataset.floor;

    floorFounder(datasetFloor);
    // setIsHovered(true);
    isHoveredRef.current = true;

    window.addEventListener("mousemove", onMouseMove);
  };

  // removes floor-info when mouseOut on element
  const handleMouseOut = (e) => {
    e.target.classList.remove("poly-fill");
    isHoveredRef.current = false;
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

  const handleUpdateClick = () => {
    setUpdatedBtnClick(!updatedBtnClick);
    console.log(updatedBtnClick);
  };

  const handleUpdatePricesClick = async (e) => {
    try {
      e.preventDefault();
      const price = +priceRef.current?.value;
      const buildingId = building.building;
      console.log("building", buildingId);

      if (!buildingId) {
        // Building ID is not selected, handle the error or show a message
        return;
      }

      const buildingQuery = query(
        collection(db, "buildings"),
        where("building", "==", buildingId)
      );
      const buildingSnapshot = await getDocs(buildingQuery);

      if (!buildingSnapshot.empty) {
        buildingSnapshot.forEach((buildingDoc) => {
          const buildingDocRef = doc(db, "buildings", buildingDoc.id);

          const floors = buildingDoc.data().floors || []; // Handle missing or empty floors array
          const updatedFloors = floors.map((floor) => {
            const apartments = floor.apartments || []; // Handle missing or empty apartments array
            const updatedApartments = apartments.map((apartment) => {
              const currentPrice = apartment.price;
              const updatedPrice = currentPrice + Number(price);
              return { ...apartment, price: updatedPrice };
            });
            return { ...floor, apartments: updatedApartments };
          });

          // Update each building document with the new apartment prices
          updateDoc(buildingDocRef, { floors: updatedFloors });
        });
      }
      setSuccessUpdate(true);
    } catch (err) {
      console.log(err.message);
    }
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
    <div className="floors-page-container">
      <div className="search-layout">
        <Search />
      </div>
      <div className="choose-building-content">
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
        {user ? (
          <button className="update-price-main-btn" onClick={handleUpdateClick}>
            ფასების მომატება
          </button>
        ) : null}
        {updatedBtnClick ? (
          <form className="update-apartments-price-form">
            <h4>ჩაწერეთ ფასი:</h4>
            <input
              type="text"
              ref={priceRef}
              placeholder="ჩაწერეთ ფასი დოლარში"
            />
            <button className="update-price" onClick={handleUpdatePricesClick}>
              ფასის მომატება
            </button>
            {successUpdate ? (
              <p className="success-prices-message">
                ფასები წარმატებით დაემატა
                <AiFillCheckCircle
                  style={{ color: "#4bb543", marginLeft: "6px" }}
                />
              </p>
            ) : (
              ""
            )}
            <TfiClose
              className="price-close-btn"
              onClick={() => setUpdatedBtnClick(false)}
            />
          </form>
        ) : (
          ""
        )}
        {5 > 4 ? "correct" : ""}
        <div>
          {isHoveredRef.current && (
            <div
              className={`floor-info ${isHovered ? "active" : ""}`}
              style={calculateFloorInfoPosition()}
            >
              <p>
                <span>
                  <HiBuildingOffice2 />
                </span>
                სართული {floor.slice(-1)}
              </p>
              <p>
                <span>
                  <ImHome />
                </span>
                დარჩენილი ბინები: {remainingApartments}
              </p>
            </div>
          )}
        </div>
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
