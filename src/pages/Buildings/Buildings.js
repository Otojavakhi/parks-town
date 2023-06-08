import { collection, getDocs } from "firebase/firestore";
import "./Building.css";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { MainUseContext } from "../../context/MainContext";
import { db } from "../../FirebaseConfig";
import chooseBuilding from "../../utils/png/choose-building.png";

export const Buildings = () => {
  return (
    <div className="choose-building-container">
      <div className="building-container">
        <svg
          id="b-svg-container"
          viewBox="0 0 803 566"
          preserveAspectRatio="none"
        >
          <Link to="building1">
            <polygon
              className="poly-fill"
              points="87,237,71,162,114,150,117,144,214,114,240,111,243,116,248,117,254,135,251,138,256,152,252,157,253,159,255,160,258,169,256,171,258,180,263,179,269,196,241,205,241,210,175,230,170,214"
            ></polygon>
          </Link>
          <Link to="building2">
            <polygon
              className="poly-fill"
              points="310,185,335,181,333,174,355,171,357,169,371,167,372,174,394,170,394,163,403,162,405,169,434,166,434,158,454,157,452,144,495,139,492,98,494,97,491,66,486,68,482,38,461,42,461,46,451,47,449,44,420,47,419,75,403,78,402,71,362,75,362,82,345,84,343,79,298,84"
            ></polygon>
          </Link>
        </svg>

        <img src={chooseBuilding} alt="choose-building" />
      </div>
      <Outlet />
    </div>
  );
};

// export const buildingLoader = async () => {
//   try {
//     const colRef = collection(db, "building2");
//     const res = await getDocs(colRef);
//     const building = res.docs.map((doc) => ({
//       ...doc.data(),
//       id: doc.id,
//     }));
//     return building;
//   } catch (error) {
//     console.log(error.message);
//   }
// };
