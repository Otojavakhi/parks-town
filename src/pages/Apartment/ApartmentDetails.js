import "./Apartmentdetails.css";
import { useLoaderData, useLocation } from "react-router-dom";
import { floorDetailLoader } from "../Floor/FloorDetails";
import { useState } from "react";
import { useEffect } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage, db } from "../../FirebaseConfig";
import { Spinner } from "../../components/Spinner/Spinner";
import { MainUseContext } from "../../context/MainContext";
import { useRef } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { CiEdit } from "react-icons/ci";
export const ApartmentDetails = () => {
  // Loads apartment's data from floors loader function
  const apartment = useLoaderData();
  const { user } = MainUseContext();
  const inputRef = useRef("");
  const location = useLocation();
  console.log(
    "loc",
    location.pathname
      .split("/")
      .filter((crumb) => crumb !== "")
      .slice(1)
  );
  const apartmentLocation = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .slice(1);

  // Changes apartment's images from visual to drawing.
  const [visual, setVisual] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [gel, setGel] = useState(null);
  const [editBtnClicked, setEditBtnClicked] = useState(false);

  // fetching current USD currency
  const USD_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.min.json";
  useEffect(() => {
    fetch(USD_URL)
      .then((res) => res.json())
      .then((data) => {
        setGel(data.usd.gel);
      });
  }, [gel]);
  console.log(gel);

  // sets Images according state value
  useEffect(() => {
    const getApartmentImages = async () => {
      try {
        const storageRef = ref(
          storage,
          visual ? apartment.drawImg : apartment.visualImg
        );
        const url = await getDownloadURL(storageRef);

        setImageUrl(url);
        setInitialLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    getApartmentImages();
  }, [visual, apartment.drawImg, apartment.visualImg]);

  // changes USD to GEL currency on button clicks ($ and ₾)
  const changeCurrency = (e) => {
    const buttons = document.querySelectorAll(
      ".apartment-price-container button"
    );

    const clickedButton = e.target.closest(".btn");
    if (!clickedButton) return;

    buttons.forEach((button) => button.classList.remove("active-price"));

    e.target.classList.add("active-price");

    if (e.target.classList.contains("usd-btn")) {
      setCurrentCurrency("USD");
    } else {
      setCurrentCurrency("GEL");
    }
  };

  const handleOptionChange = async () => {
    const inputValue = inputRef.current.value;
    console.log(inputValue);

    const updatedApartment = { ...apartment, view: inputValue };
    console.log(updatedApartment);

    const buildingLoc = apartmentLocation[0];
    const floorLoc = apartmentLocation[1];
    const apartmentLoc = apartmentLocation[2];

    const buildingQuery = query(
      collection(db, "buildings"),
      where("building", "==", buildingLoc)
    );
    const buildingSnapshot = await getDocs(buildingQuery);

    buildingSnapshot.forEach((buildingDoc) => {
      const buildingId = buildingDoc.id;
      const buildingRef = doc(db, "buildings", buildingId);

      const floors = buildingDoc.data().floors;
      const updatedFloors = floors.map((floor) => {
        if (floor.floor === floorLoc) {
          const updatedApartments = floor.apartments.map((apartment) => {
            if (apartment.apartment === apartmentLoc) {
              return { ...apartment, view: inputValue };
            } else {
              return apartment;
            }
          });

          return { ...floor, apartments: updatedApartments };
        } else {
          return floor;
        }
      });

      updateDoc(buildingRef, { floors: updatedFloors });
    });
  };

  const handleEditClick = (e) => {
    console.log(e.target.value);
  };

  if (initialLoading)
    return (
      <div className="isloading">
        <Spinner />
      </div>
    );
  return (
    <div className="apartment-details">
      <div className="apartment-description">
        <div className="apartment-price">
          <div onClick={changeCurrency} className="apartment-price-container">
            <h3>ფასი</h3>
            <div className="price-buttons">
              <button className="btn usd-btn active-price">USD</button>
              <button className="btn gel-btn">GEL</button>
            </div>
          </div>
          <p>
            {currentCurrency === "USD"
              ? apartment.price
              : (apartment.price * gel).toFixed(2)}{" "}
            {currentCurrency === "USD" ? "$" : "₾"}
          </p>
        </div>
        <div className="apartment-details-info">
          <span className="info-display">
            <h4>ბინა</h4>
            <span>{apartment.apartment.slice(-1)} </span>
          </span>
          <span className="info-display">
            <h4>სართული</h4>
            <span>{apartment.floor.slice(-1)}</span>
          </span>
          <span className="info-display">
            <h4>ბინის ფართი</h4>
            <span>{apartment.square}</span>
          </span>
          <span className="info-display">
            <h4>საცხოვრებელი ფართი</h4>
            <span>{apartment.livingSquare}</span>
          </span>
          <span className="info-display">
            <h4>აივანი</h4>
            <span>{apartment.balcony}</span>
          </span>
          {/* <span className="info-display">
            <h4>ხედი</h4>
            <span>{apartment.view}</span>
          </span> */}
          {user ? (
            <span className="info-display">
              {/* <h4>status</h4>
              <select name="" id="">
                <option value="false">გასაყიდი</option>
                <option value="true">გაიყიდა</option>
              </select>
              <span>{apartment.sold}</span> */}
              <span>
                ბინის სტატუსი: {apartment.sold ? "გაიყიდა" : "იყიდება"}{" "}
                <CiEdit
                  className="edit-icon"
                  onClick={() => setEditBtnClicked(!editBtnClicked)}
                />
              </span>
              {/* <input type="text" ref={inputRef} />
              <button onClick={handleOptionChange}>change</button> */}
            </span>
          ) : null}
        </div>
        {editBtnClicked ? (
          <div className="edit-apartment-container">
            <h5>აირჩიეთ ბინის სტატუსი</h5>
            <select name="" id="" onClick={handleEditClick}>
              <option value="false">იყიდება</option>
              <option value="true">გაიყიდა</option>
            </select>
            <button>შენახვა</button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="apartment-imgs">
        <button onClick={() => setVisual(!visual)}>
          {visual ? "ვიზუალი" : "ნახაზი"}
        </button>

        <img src={imageUrl} alt={`ბინა-${apartment.apartment}`} />
      </div>
    </div>
  );
};

export const apartmentDetailsLoader = async ({ params }) => {
  try {
    const { apart } = params;

    const floor = await floorDetailLoader({ params });
    console.log("floor", floor);

    const apartment = floor.apartments.find((ap) => ap.apartment === apart);

    if (!apartment) throw Error("Apartment doesn't exists!");

    return apartment;
  } catch (error) {
    throw Error("Apartment doesn't exists!");
  }
};
