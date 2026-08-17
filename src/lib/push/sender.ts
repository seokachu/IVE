//푸시 발송 공통 모듈 — API 라우트 전용 (클라이언트에서 import 금지)
//push_tokens의 platform 값으로 채널을 나눈다: "web"은 web-push(VAPID), 나머지는 Expo Push API
import webpush from "web-push";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export type PushTokenRow = { token: string; user_id: string; platform: string | null };
export type PushMessage = { title: string; body: string; url: string };

//VAPID 키가 없으면 웹 채널만 건너뛴다 (Expo 발송에는 영향 없음)
const configureWebPush = () => {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:admin@ive-dive.app", publicKey, privateKey);
  return true;
};

//기기별 채널로 발송하고 만료된 토큰 목록을 돌려준다 (호출부가 push_tokens에서 삭제)
export const sendPushMessages = async (rows: PushTokenRow[], messageFor: (userId: string) => PushMessage) => {
  const expoRows = rows.filter((row) => row.platform !== "web");
  const webRows = rows.filter((row) => row.platform === "web");
  const staleTokens: string[] = [];
  let sent = 0;

  if (expoRows.length > 0) {
    try {
      const messages = expoRows.map(({ token, user_id }) => {
        const message = messageFor(user_id);
        return { to: token, title: message.title, body: message.body, data: { url: message.url } };
      });
      const expoResponse = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messages),
      });
      const expoResult = await expoResponse.json();

      //만료된 토큰(앱 삭제 등) 감지
      (expoResult.data ?? []).forEach(
        (ticket: { status: string; details?: { error?: string } }, index: number) => {
          if (ticket.status === "error" && ticket.details?.error === "DeviceNotRegistered") {
            staleTokens.push(expoRows[index].token);
          } else if (ticket.status === "ok") {
            sent += 1;
          }
        },
      );
    } catch (error) {
      console.error("Expo 푸시 발송 실패:", error);
    }
  }

  if (webRows.length > 0 && configureWebPush()) {
    await Promise.all(
      webRows.map(async ({ token, user_id }) => {
        const message = messageFor(user_id);
        try {
          await webpush.sendNotification(JSON.parse(token), JSON.stringify(message));
          sent += 1;
        } catch (error) {
          //404/410 = 구독 만료(브라우저에서 알림 차단·구독 해제)
          const statusCode = (error as { statusCode?: number }).statusCode;
          if (statusCode === 404 || statusCode === 410) {
            staleTokens.push(token);
          } else {
            console.error("웹 푸시 발송 실패:", error);
          }
        }
      }),
    );
  }

  return { sent, staleTokens };
};
