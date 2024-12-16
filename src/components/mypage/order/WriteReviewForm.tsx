import { Tables } from "@/types/supabase";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { reviewSchema, type ReviewType } from "@/hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import InteractiveStars from "@/utils/InteractiveStars";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAddOrderItemReview } from "@/hooks/queries/useReviews";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import { toast } from "@/hooks/use-toast";

interface ReviewFormData {
  rating: number;
  content: string;
}
interface WriteReviewFormProps {
  mode: "create" | "edit";
  reviewData?: Tables<"goods_reviews">;
  onClose: () => void;
}

const WriteReviewForm = ({
  mode,
  reviewData,
  onClose,
}: WriteReviewFormProps) => {
  const session = useRecoilValue(sessionState);
  const { mutate: addOrderItemReview } = useAddOrderItemReview();
  // const { mutate: updateItemReview } = useAddOrderItemReview();
  const form = useForm<ReviewType>({
    mode: "onChange",
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: mode === "edit" ? reviewData?.rating || 0 : 0,
      content: mode === "edit" ? reviewData?.content || "" : "",
    },
  });

  console.log("reviewData!!", reviewData);
  console.log("session", session);

  const { isValid, isSubmitting } = form.formState;
  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = form;

  const currentRating = watch("rating");

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating);
  };

  const handleSubmit = (data: ReviewFormData) => {
    const reviewInput = {
      user_id: session?.user?.id,
      order_id: reviewData?.order_id,
      goods_id: reviewData?.goods_id,
      created_at: new Date().toISOString(),
      name: session?.user?.user_metadata?.name || "",
      rating: data.rating,
      content: data.content,
    };

    addOrderItemReview(reviewInput);
    onClose();

    toast({
      title: "리뷰가 등록되었습니다.",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full lg:max-w-[500px] mx-auto"
      >
        <div className="space-y-2 mb-5">
          <Label>
            별점
            <span className="translate-y-[3px] inline-block text-red ml-1">
              *
            </span>
          </Label>
          <InteractiveStars
            size={24}
            rating={currentRating}
            onChange={handleRatingChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content" className="mb-2">
            내용
            <span className="translate-y-[3px] inline-block text-red ml-1">
              *
            </span>
          </Label>
          <Textarea
            {...register("content")}
            className="w-full min-h-[250px]"
            placeholder="리뷰 내용을 입력해주세요. (최소 10자)"
            maxLength={200}
          />
          {errors.content && (
            <p className="text-red text-xs mt-1">{errors.content.message}</p>
          )}
        </div>
        <Button
          disabled={!isValid || isSubmitting}
          type="submit"
          className="py-2 w-full mt-5 text-sm"
        >
          {isSubmitting
            ? "처리 중..."
            : mode === "create"
            ? "리뷰 작성"
            : "리뷰 수정"}
        </Button>
      </form>
    </Form>
  );
};

export default WriteReviewForm;
