import { useRouteError } from "react-router-dom";

const ApartmentError = () => {
  const error = useRouteError();
  return (
    <div className="apartment-error">
      <h1>{error.message}</h1>
    </div>
  );
};

export default ApartmentError;
