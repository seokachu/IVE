import { supabase } from './client';
import type { CustomerInfoInsert } from '@/types';

export const getCustomerInfo = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('customer_info').select('*').eq('user_id', userId).maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`주문자 정보를 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

export const saveCustomerInfo = async (info: CustomerInfoInsert) => {
  try {
    const { data, error } = await supabase
      .from('customer_info')
      .upsert(info, {
        onConflict: 'user_id',
        ignoreDuplicates: false, // 중복을 무시하지 않고 업데이트
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`주문자 정보를 저장하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
