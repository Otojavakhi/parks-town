import "./Search.css";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MainUseContext } from "../../context/MainContext";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

export const Search = () => {
  const [isFiltered, setIsFiltered] = useState(false);
  const [foundApartments, setFoundApartments] = useState([]);
  const navigate = useNavigate();

  const refMinSquare = useRef(25);
  const refMaxSquare = useRef(150);

  const { buildingData } = MainUseContext();

  console.log(buildingData);
  useEffect(() => {
    if (refMaxSquare.current) {
      refMaxSquare.current.value = "120";
    }
  }, []);

  const searchSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);

    const minSquare = refMinSquare.current.value;
    const maxSquare = refMaxSquare.current.value;
    console.log(minSquare);
    console.log(maxSquare);

    // founds apartments according selected options and wich is not sold apartment.
    const foundApartments = buildingData.floors
      .flatMap((floor) => floor.apartments)
      .filter(
        (apartment) =>
          apartment.square > minSquare &&
          apartment.square < maxSquare &&
          apartment.sold !== true
      );
    console.log(foundApartments);
    setFoundApartments(foundApartments);
    setIsFiltered(true);
  };

  const handleNavigateApartment = (e) => {
    const parentElement = e.target.closest(".apartment-list-item");
    const datasetApartment = parentElement.dataset?.apartment;

    navigate(datasetApartment);
  };
  return (
    <div className="search-container">
      <div className="search-form-details">
        <form className="search-form" onSubmit={searchSubmit}>
          <span className="search-title">
            <h4>მოძებნე ფართით </h4>
          </span>
          <label htmlFor="minSquare"></label>
          <select
            className="select-form"
            id="minSquare"
            name="minSquare"
            ref={refMinSquare}
          >
            <option value="25">მინ.ფართი</option>
            <option value="50">50</option>
            <option value="70">70</option>
            <option value="90">90</option>
            <option value="120">120</option>
          </select>

          <label htmlFor="maxSquare"></label>
          <select
            className="select-form"
            id="maxSquare"
            name="maxSquare"
            ref={refMaxSquare}
          >
            <option value="35">35</option>
            <option value="50">50</option>
            <option value="70">70</option>
            <option value="90">90</option>
            <option value="120">მაქს.ფართი</option>
          </select>

          <button className="search-submit" type="submit">
            <BsSearch className="search-icon" />
            მოძებნე ბინა
          </button>
        </form>
      </div>
      <div className="found-apartments-list">
        <div className="found-apartments-info">
          <span>სართული</span>
          <span>ბინა</span>
          <span>ფართი</span>
          <span>ფასი</span>
        </div>
        <ul onClick={handleNavigateApartment}>
          {isFiltered &&
            foundApartments.map((apartment, i) => {
              const isEven = i % 2 === 0;
              return (
                <li
                  data-apartment={`${apartment.floor}/${apartment.apartment}`}
                  className={`apartment-list-item ${isEven ? "even" : ""}`}
                  key={apartment.apartment}
                >
                  <span>{apartment.floor.slice(-1)}</span>
                  <span>{apartment.apartment.slice(-1)}</span>
                  <span>{apartment.square} მ2</span>
                  <span>{apartment.price} $</span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
