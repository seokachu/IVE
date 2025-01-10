import { Skeleton } from "@/components/ui/skeleton";

const SignInLoading = () => {
  return (
    <section className="max-w-[500px] w-full px-5">
      <div className="flex items-center justify-center flex-col mb-10">
        <Skeleton className="w-[100px] h-10 my-5" />
        <Skeleton className="w-16 h-8" />
      </div>
      <div className="w-full flex flex-col items-center gap-5">
        <Skeleton className="w-full max-w-[320px] h-12 rounded-full" />
        <Skeleton className="w-full max-w-[320px] h-12 rounded-full" />
      </div>
    </section>
  );
};

export default SignInLoading;
