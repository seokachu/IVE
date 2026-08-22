import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { truncate } from "@/utils/truncate";
import { sendPushMessages } from "@/lib/push/sender";

//댓글 작성 시 게시글 작성자(+대댓글이면 원댓글 작성자)에게 푸시 알림 발송
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
      .select("id, user_id, board_id, parent_id, content")
      .eq("id", commentId)
      .single();
    if (!comment || comment.user_id !== user.id || comment.board_id !== boardId) {
      return NextResponse.json({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    const { data: board } = await admin.from("board").select("id, title, user_id").eq("id", boardId).single();
    if (!board) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    //수신자 결정: 글 작성자 + (대댓글이면) 원댓글 작성자. 본인은 제외하고,
    //글 작성자와 원댓글 작성자가 같으면 더 구체적인 답글 알림 하나만 보낸다.
    const recipients = new Map<string, "comment" | "reply">();
    if (board.user_id && board.user_id !== user.id) {
      recipients.set(board.user_id, "comment");
    }
    if (comment.parent_id) {
      const { data: parentComment } = await admin
        .from("board_comments")
        .select("user_id")
        .eq("id", comment.parent_id)
        .single();
      if (parentComment?.user_id && parentComment.user_id !== user.id) {
        recipients.set(parentComment.user_id, "reply");
      }
    }
    if (recipients.size === 0) {
      return NextResponse.json({ skipped: true });
    }

    const { data: tokens } = await admin
      .from("push_tokens")
      .select("token, user_id, platform")
      .in("user_id", [...recipients.keys()])
      .eq("enabled", true);
    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ skipped: true });
    }

    const { data: commenter } = await admin.from("user").select("name").eq("id", user.id).single();
    const commenterName = commenter?.name ?? "누군가";
    const boardTitle = truncate(board.title ?? "게시글", { length: 15, omission: "..." });
    const origin = new URL(request.url).origin;

    //내용 미리보기: 제목이 맥락을, 본문이 댓글 내용을 담는다.
    //잠금화면 노출 여부는 OS의 민감한 알림 설정에 위임한다.
    const contentPreview = truncate((comment.content ?? "").trim(), { length: 40, omission: "..." });

    //Expo(앱)·web-push(브라우저) 채널로 함께 발송
    const { sent, staleTokens } = await sendPushMessages(tokens, (userId) => ({
      title:
        recipients.get(userId) === "reply"
          ? "내 댓글에 답글이 달렸습니다"
          : `"${boardTitle}" 글에 새 댓글이 달렸습니다`,
      body: contentPreview ? `${commenterName}: ${contentPreview}` : `${commenterName}님이 댓글을 남겼습니다.`,
      url: `${origin}/board/${boardId}`,
    }));

    //만료된 토큰 정리
    if (staleTokens.length > 0) {
      await admin.from("push_tokens").delete().in("token", staleTokens);
    }

    return NextResponse.json({ sent });
  } catch (error) {
    console.error("푸시 발송 실패:", error);
    return NextResponse.json({ error: "푸시 발송에 실패했습니다." }, { status: 500 });
  }
}
