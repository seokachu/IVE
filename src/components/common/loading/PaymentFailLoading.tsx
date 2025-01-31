import { Skeleton } from "@/components/ui/skeleton";

const PaymentFailLoading = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:-mt-20 md:mt-0">
      <div className="flex items-center justify-center flex-col max-w-md w-full">
        <Skeleton className="w-full max-w-72 h-8 mb-4" />
        <Skeleton className="w-full max-w-52 h-5 mb-6" />
        <Skeleton className="w-full max-w-52 h-10" />
      </div>
    </main>
  );
};

export default PaymentFailLoading;
