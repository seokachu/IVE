import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    console.log("Payment API route called with:", { paymentKey, orderId, amount });
    console.log("Environment variables:", {
      confirmUrl: process.env.PAYMENT_CONFIRM_URL,
      hasSecretKey: !!process.env.TOSS_SECRET_KEY
    });

    const response = await axios.post(
      process.env.PAYMENT_CONFIRM_URL!,
      {
        paymentKey,
        orderId,
        amount,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Response from Toss API:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error in payment API route:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          ...error.response.data,
          message: error.response.data.message || '결제 처리 중 오류가 발생했습니다.',
        },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}