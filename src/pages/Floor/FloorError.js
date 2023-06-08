import { useRouteError } from "react-router-dom";

export default function FloorError() {
  const error = useRouteError();
  return (
    <div className="floor-error">
      <h3>{error.message}</h3>
    </div>
  );
}
