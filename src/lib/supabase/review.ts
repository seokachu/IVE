import { supabase } from '@/lib/supabase/client';
import type { OrderReviewInsert } from '@/types';

//전체 리뷰 불러오기 (카운트)
export const getGoodsReviewsCount = async (goodsId: string) => {
  try {
    const { data, error } = await supabase.from('goods_reviews').select('*').eq('goods_id', goodsId);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`전체 리뷰 정보를 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//페이지네이션 전체 리뷰 불러오기
export const getGoodsReviews = async (goodsId: string, page: number) => {
  const itemsPerPage = 5;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  try {
    //전체 개수 가져오기
    const { count } = await supabase
      .from('goods_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('goods_id', goodsId);

    //페이지 데이터 가져오기
    const { data, error } = await supabase
      .from('goods_reviews')
      .select(
        `
      *,
      user:user_id(
        name,
        avatar_url
      )
    `
      )
      .eq('goods_id', goodsId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      reviews: data || [],
      totalCount: count || 0,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`리뷰 정보를 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//리뷰 평균
export const getAverageRating = async (goodsId: string) => {
  const { data, error } = await supabase.from('goods_reviews').select('rating').eq('goods_id', goodsId);
  if (error) throw error;

  if (!data || data.length === 0) {
    return 0;
  }

  const average = data.reduce((sum, review) => sum + review.rating, 0) / data.length;

  return Number(average.toFixed(1));
};

//단일 리뷰 가져오기
export const getOrderItemReview = async (orderId: string, productId: string) => {
  try {
    const { data, error } = await supabase
      .from('goods_reviews')
      .select('*, user:user(name, avatar_url)')
      .eq('order_id', orderId)
      .eq('goods_id', productId)
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) return null;
    const result = data[0];

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`리뷰를 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//리뷰 추가
export const saveOrderItemReview = async ({
  order_id,
  goods_id,
  user_id,
  rating,
  content,
  created_at,
  name,
}: OrderReviewInsert) => {
  try {
    const { data, error } = await supabase
      .from('goods_reviews')
      .insert({
        order_id,
        goods_id,
        user_id,
        rating,
        content,
        created_at,
        name,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`리뷰를 저장하는데 실패했습니다.${error.message}`);
    }
    throw error;
  }
};

//리뷰 수정
export const updateOrderItemReview = async (
  reviewId: string,
  { rating, content }: Pick<OrderReviewInsert, 'rating' | 'content'>
) => {
  try {
    const { data, error } = await supabase
      .from('goods_reviews')
      .update({
        rating,
        content,
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`리뷰를 수정하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
