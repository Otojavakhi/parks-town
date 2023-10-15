import "./Breadcrumbs.css";
import { Link, useLocation } from "react-router-dom";
import { FaBuilding } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ImHome } from "react-icons/im";
import { BsFillBuildingsFill } from "react-icons/bs";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { MainUseContext } from "../../context/MainContext";

export const Breadcrumbs = () => {
  const { setApartmentLocation } = MainUseContext();
  const location = useLocation();
  let currentLink = "";
  const cond = false;

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb, index, array) => {
      // Hides choose-building crumb

      let icon = "";
      let text = "";
      currentLink += `/${crumb}`;
      console.log(array);

      // assings icons according crumb value
      if (array[index] === "choose-building") {
        icon = <BsFillBuildingsFill />;
        text = "აირჩიე შენობა";
      } else if (array[index].includes("building")) {
        icon = <FaBuilding />;
        text = "შენობა";
      } else if (array[index].includes("floor")) {
        icon = <HiBuildingOffice2 />;
        text = "სართული";
      } else if (array[index].includes("apartment")) {
        icon = <ImHome />;
        text = "ბინა";
      }

      // Avoids to display GrNext icon on last element
      const isLast = index === array.length - 1;

      return (
        <div className="crumb" key={crumb}>
          <span className="link-icons">{icon}</span>
          <Link className="crumb-link" to={currentLink}>
            {/* {cond ? crumb.split("-").join(" ") : `${text} ${crumb.slice(-1)}`} */}
            {index === 0
              ? `${text}`
              : cond
              ? crumb.split("-").join(" ")
              : `${text} ${crumb.slice(-1)}`}
          </Link>
          {!isLast && <TbPlayerTrackNextFilled className="next-icon" />}
        </div>
      );
    });

  return <div className="bread-crumbs">{crumbs}</div>;
};
