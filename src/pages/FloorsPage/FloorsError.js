import { useRouteError } from "react-router-dom";

export const FloorsError = () => {
  const error = useRouteError();
  return <div>{error.message}</div>;
};
