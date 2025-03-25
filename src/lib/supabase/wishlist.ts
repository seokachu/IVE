import { supabase } from './client';

//찜하기 추가
export const addToWishList = async (userId: string, productId: string) => {
  try {
    const { data, error } = await supabase
      .from('wish_lists')
      .insert([
        {
          user_id: userId,
          product_id: productId,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`찜 목록을 추가하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//찜하기 취소
export const removeWishList = async (userId: string, productId: string) => {
  try {
    const { error } = await supabase.from('wish_lists').delete().match({
      user_id: userId,
      product_id: productId,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`찜 목록을 취소하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//사용자 전체 찜 목록 불러오기
export const getUserWishList = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('wish_lists')
      .select(
        `*,
        goods:product_id(
          id,
          title,
          thumbnail,
          price,
          discount_rate
        )
        `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`사용자의 전체 찜 목록 리스트를 불러오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//사용자 특정 아이템 찜하기 여부 확인
export const checkedWishLists = async (userId: string, productId: string) => {
  try {
    const { data, error } = await supabase
      .from('wish_lists')
      .select('*')
      .match({
        user_id: userId,
        product_id: productId,
      })
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`찜 목록을 확인하는데 실패했습니다. ${error.message}`);
    }
    return false;
  }
};
