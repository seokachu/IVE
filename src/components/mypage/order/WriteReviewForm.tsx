import { Tables } from "@/types/supabase";

interface WriteReviewFormProps {
  mode: "create" | "edit";
  initialData?: Tables<"goods_reviews">;
}

const WriteReviewForm = ({}) => {
  return <div>리뷰폼</div>;
};

export default WriteReviewForm;
