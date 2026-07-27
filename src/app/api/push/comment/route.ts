import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { truncate } from "lodash";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

//댓글 작성 시 게시글 작성자에게 푸시 알림 발송
export async function POST(request: Request) {
  try {
    const { boardId, commentId } = await request.json();
    if (typeof boardId !== "number" || typeof commentId !== "number") {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    //쿠키 세션으로 댓글 작성자 본인 확인
    const cookieStore = await cookies();
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      },
    );
    const {
      data: { user },
    } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json({ error: "푸시 발송 설정이 완료되지 않았습니다." }, { status: 500 });
    }
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
      auth: { persistSession: false },
    });

    //요청한 댓글이 실제로 본인이 방금 작성한 댓글인지 검증
    const { data: comment } = await admin
      .from("board_comments")
      .select("id, user_id, board_id")
      .eq("id", commentId)
      .single();
    if (!comment || comment.user_id !== user.id || comment.board_id !== boardId) {
      return NextResponse.json({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    const { data: board } = await admin.from("board").select("id, title, user_id").eq("id", boardId).single();
    //본인 글에 단 댓글은 알림 제외
    if (!board?.user_id || board.user_id === user.id) {
      return NextResponse.json({ skipped: true });
    }

    const { data: tokens } = await admin.from("push_tokens").select("token").eq("user_id", board.user_id);
    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ skipped: true });
    }

    const { data: commenter } = await admin.from("user").select("name").eq("id", user.id).single();
    const commenterName = commenter?.name ?? "누군가";
    const boardTitle = truncate(board.title ?? "게시글", { length: 15, omission: "..." });
    const origin = new URL(request.url).origin;

    const messages = tokens.map(({ token }) => ({
      to: token,
      title: "새 댓글이 달렸습니다",
      body: `${commenterName}님이 "${boardTitle}" 글에 댓글을 남겼습니다.`,
      data: { url: `${origin}/board/${boardId}` },
    }));

    const expoResponse = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });
    const expoResult = await expoResponse.json();

    //만료된 토큰 정리
    const staleTokens = (expoResult.data ?? [])
      .map((ticket: { status: string; details?: { error?: string } }, index: number) =>
        ticket.status === "error" && ticket.details?.error === "DeviceNotRegistered" ? tokens[index].token : null,
      )
      .filter(Boolean);
    if (staleTokens.length > 0) {
      await admin.from("push_tokens").delete().in("token", staleTokens);
    }

    return NextResponse.json({ sent: messages.length - staleTokens.length });
  } catch (error) {
    console.error("푸시 발송 실패:", error);
    return NextResponse.json({ error: "푸시 발송에 실패했습니다." }, { status: 500 });
  }
}
