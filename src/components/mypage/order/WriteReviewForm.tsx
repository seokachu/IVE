import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { reviewSchema, type ReviewType } from "@/hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import InteractiveStars from "@/utils/InteractiveStars";
import { Textarea } from "@/components/ui/textarea";
import { useAddOrderItemReview, useUpdateOrderItemReview } from "@/hooks/queries/useReviews";
import { toast } from "@/hooks/use-toast";
import type { ReviewFormData, WriteReviewFormProps } from "@/types/mypage";
import { useSession } from "@/store/zustand";

//점수별 캡션 (1~5점)
const RATING_CAPTIONS = ["아쉬워요", "그저 그래요", "보통이에요", "마음에 들어요", "최고예요"];

const WriteReviewForm = ({ mode, reviewData, orderId, goodsId, onClose }: WriteReviewFormProps) => {
  const session = useSession();
  const { mutate: addOrderItemReview } = useAddOrderItemReview();
  const { mutate: updateItemReview } = useUpdateOrderItemReview();
  const form = useForm<ReviewType>({
    mode: "onChange",
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: mode === "edit" ? reviewData?.rating || 0 : 0,
      content: mode === "edit" ? reviewData?.content || "" : "",
    },
  });

  const { isValid, isSubmitting } = form.formState;
  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = form;

  const currentRating = watch("rating");
  const contentLength = (watch("content") || "").length;

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating, {
      shouldValidate: true,
    });
  };

  const handleSubmit = (data: ReviewFormData) => {
    //리뷰 추가 mode
    if (mode === "create") {
      const reviewInput = {
        user_id: session?.user?.id,
        order_id: orderId,
        goods_id: goodsId,
        created_at: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(),
        name: session?.user?.user_metadata?.name || "",
        rating: data.rating,
        content: data.content,
      };
      addOrderItemReview(reviewInput);

      toast({
        title: "리뷰가 등록되었습니다.",
      });
    }
    //리뷰수정 Mode
    else {
      //기존 리뷰와 별점이 변경되었는지 체크
      const isChanged = data.rating !== reviewData!.rating || data.content !== reviewData!.content;

      if (!isChanged) {
        toast({
          title: "변경된 내용이 없습니다.",
          variant: "destructive",
        });
        return;
      }

      updateItemReview({
        id: reviewData!.id,
        rating: data.rating,
        content: data.content,
      });

      toast({
        title: "리뷰가 수정되었습니다.",
      });
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
        {/* 별점 — 시안 기준 센터 정렬 + 점수별 캡션 */}
        <div className="flex flex-col items-center gap-2.5 py-1">
          <Label className="text-sm font-semibold">굿즈는 만족하셨나요?</Label>
          <input type="hidden" {...register("rating")} />
          <InteractiveStars size={30} rating={currentRating} onChange={handleRatingChange} />
          <p className="text-xs text-gray-400">
            {currentRating > 0 ? `${currentRating}점 · ${RATING_CAPTIONS[currentRating - 1]}` : "별점을 선택해주세요"}
          </p>
          {errors.rating && <p className="text-red text-xs">{errors.rating.message}</p>}
        </div>
        <div className="mt-4">
          <Textarea
            {...register("content")}
            className="min-h-[120px] w-full rounded-lg border-gray-200 text-[13px]"
            placeholder="좋았던 점을 다이브들과 나눠보세요 (최소 10자)"
            maxLength={200}
            aria-label="리뷰 내용"
          />
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {errors.content ? <p className="text-red text-xs">{errors.content.message}</p> : <span />}
            <span className="text-[11px] text-gray-400">{contentLength} / 200</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[46px] rounded-full border border-gray-300 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1 h-[46px] rounded-full bg-purple-300 text-sm font-bold text-white hover:bg-purple-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "처리 중..." : mode === "create" ? "등록하기" : "수정하기"}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default WriteReviewForm;
