"use client";
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/common/Spinner";
import { useInvalidateMembership } from "@/hooks/queries/useMembership";
import { toast } from "@/hooks/use-toast";

//토스 빌링 successUrl/failUrl 처리 — authKey를 서버로 넘겨 구독 시작 또는 카드 변경
const BillingResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invalidateMembership = useInvalidateMembership();
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const authKey = searchParams.get("authKey");
    const tier = searchParams.get("tier");
    const isCardChange = searchParams.get("mode") === "card";
    const isFail = searchParams.get("fail") === "1" || !authKey;

    const finish = () => router.replace("/mypage/membership");

    if (isFail) {
      toast({ title: "카드 등록이 완료되지 않았습니다.", description: "다시 시도해주세요.", variant: "destructive" });
      finish();
      return;
    }

    const endpoint = isCardChange ? "/api/membership/change-card" : "/api/membership/subscribe";
    const body = isCardChange ? { authKey } : { authKey, tier };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        invalidateMembership();
        toast({
          title: isCardChange ? "결제 수단이 변경되었습니다." : "DIVE 멤버십 구독을 시작했어요!",
          description: isCardChange ? "다음 결제일부터 새 카드로 결제돼요." : "이제 전용 뱃지와 혜택을 만나보세요.",
        });
      })
      .catch((error) => {
        toast({
          title: isCardChange ? "결제 수단 변경에 실패했습니다." : "구독 처리에 실패했습니다.",
          description: error instanceof Error ? error.message : "다시 시도해주세요.",
          variant: "destructive",
        });
      })
      .finally(finish);
  }, [searchParams, router, invalidateMembership]);

  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-3">
      <Spinner />
      <p className="text-sm text-gray-500">결제 정보를 처리하고 있어요...</p>
    </div>
  );
};

const BillingPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-[300px] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <BillingResult />
    </Suspense>
  );
};

export default BillingPage;
