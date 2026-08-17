import { upsertPushToken } from "@/lib/supabase/pushToken";

//웹 푸시(브라우저) 구독 헬퍼 — 구독 JSON을 push_tokens에 platform="web"으로 저장하면
//기존 Expo 토큰과 같은 테이블·같은 enabled 토글로 발송 시점에 함께 걸러진다

export const isWebPushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

//VAPID 공개키(base64url) → PushManager.subscribe가 요구하는 Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
};

//이 브라우저를 알림 수신 기기로 등록 (알림 권한 요청 포함)
export const subscribeWebPush = async (userId: string) => {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!isWebPushSupported() || !vapidPublicKey) {
    throw new Error("unsupported");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("permission-denied");
  }

  await navigator.serviceWorker.register("/sw.js");
  const registration = await navigator.serviceWorker.ready;

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    }));

  await upsertPushToken(userId, JSON.stringify(subscription), "web");
};
