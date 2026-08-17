//웹 푸시 서비스 워커 — 페이지가 닫혀 있어도 브라우저가 이 워커를 깨워 알림을 띄운다
//(오프라인 캐싱은 하지 않는다 — 푸시 수신·클릭 라우팅 전용)

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

//서버(web-push)가 보낸 { title, body, url } 페이로드를 알림으로 표시
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data?.json() ?? {};
  } catch {
    payload = { body: event.data?.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "IVE-DIVE", {
      body: payload.body ?? "",
      icon: "/images/app-icon-192.png",
      badge: "/images/app-icon-192.png",
      data: { url: payload.url ?? "/" },
    }),
  );
});

//알림 탭 → 열린 창이 있으면 해당 게시글로 이동, 없으면 새 창
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
