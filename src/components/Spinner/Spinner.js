import { ThreeDots } from "react-loader-spinner";

export const Spinner = () => {
  return (
    <ThreeDots
      height="120"
      width="120"
      radius="9"
      color="#4fa94d"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClassName=""
      visible={true}
    />
  );
};
