import { BounceLoader } from "react-spinners";

const Error = () => {
  return (
    <div className="flex justify-center gap-3 flex-col items-center">
      <BounceLoader color="red" />
      <h1 className="text-[50px]">Oops!</h1>
      <p>잠시 후 다시 확인해주세요...</p>
    </div>
  );
};

export default Error;
