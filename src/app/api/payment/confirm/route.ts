import { NextRequest, NextResponse } from "next/server";

export async function POST(response: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await response.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        {
          message: "결제 승인에 필요한 항목이 누락되었습니다.",
          error: "paymentKey, orderId, amount는 필수 항목입니다.",
        },
        { status: 400 }
      );
    }

    const tossRes = await fetch(`${process.env.PAYMENT_CONFIRM_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.TOSS_SECRET_KEY}:`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await tossRes.json();

    if (!tossRes.ok) {
      return NextResponse.json(
        { message: data.message || "Toss 결제 승인 실패", ...data },
        { status: tossRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "결제 승인 처리 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
