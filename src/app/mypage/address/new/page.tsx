"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AddressForm from "@/components/mypage/address/AddressForm";
import MyPageTitle from "@/components/mypage/MyPageTitle";

const AddressNewPage = () => {
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/mypage/address")}
        className="mb-5 flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-2 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-gray-50"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        배송지 관리로
      </button>
      <MyPageTitle title="새 배송지 추가" />
      <div className="rounded-2xl border border-gray-200 p-6 lg:p-7">
        <AddressForm />
      </div>
    </div>
  );
};

export default AddressNewPage;
