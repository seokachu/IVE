import Spinner from "@/components/common/Spinner";

const Error = () => {
  return (
    <section className="flex justify-center gap-3 flex-col items-center mt-60">
      <Spinner className="text-red" />
      <h1 className="text-[50px]">Oops!</h1>
      <p>잠시 후 다시 확인해주세요...</p>
    </section>
  );
};

export default Error;
