import { BounceLoader } from "react-spinners";

const Error = () => {
  return (
    <section className="flex justify-center gap-3 flex-col items-center mt-60">
      <BounceLoader color="red" />
      <h1 className="text-[50px]">Oops!</h1>
      <p>잠시 후 다시 확인해주세요...</p>
    </section>
  );
};

export default Error;
