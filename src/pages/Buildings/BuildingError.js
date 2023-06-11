import { useRouteError } from "react-router-dom";

export const BuildingError = () => {
  const error = useRouteError();
  return (
    <div className="building-error">
      <h1>{error.message}</h1>
    </div>
  );
};
