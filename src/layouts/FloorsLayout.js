import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs/Breadcrumbs";

const FloorsLayout = () => {
  return (
    <div className="floors-layout">
      {/* <p>breadcrumbs</p> */}
      <Breadcrumbs />
      <Outlet />
    </div>
  );
};

export default FloorsLayout;
