"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";
import type { YouTubePlayer } from "@/types/main";

interface VisualSectionProps {
  videoId: string | null;
  /** SSR 시점의 사이트 origin — 임베드 origin 파라미터. 브라우저 origin과 다르면(로컬·프리뷰) 클라이언트에서 바로잡는다 */
  siteOrigin: string | null;
}

const IFRAME_API_URL = "https://www.youtube.com/iframe_api";

//재생 실패 시 iframe을 새로 만들어 다시 붙이는 횟수 상한 — 넘으면 썸네일 폴백을 그대로 둔다
const MAX_RETRY = 3;
//iframe이 로드되기 시작한 뒤 재생이 시작될 때까지 기다리는 시간 — 짧게 잡으면 느릴 뿐인 플레이어를
//죽이고 처음부터 다시 붙이느라 재생이 오히려 늦어진다(실측 1차 시도가 7초를 넘기는 경우가 있었다)
const BOOT_TIMEOUT_MS = 12000;
//버퍼링은 "막힘"이 아니라 진행 신호라 타이머를 이만큼 연장한다. 버퍼링이 반복되면 계속
//연장되지만, 그건 플레이어가 살아 있다는 뜻이라 죽이지 않는 편이 낫다
const BUFFER_GRACE_MS = 10000;

//배경 장식 재생용 플레이어 파라미터 — iframe src에 그대로 싣는다
const PLAYER_VARS = {
  autoplay: "1",
  mute: "1",
  controls: "0",
  loop: "1",
  modestbranding: "1",
  rel: "0",
  playsinline: "1",
  disablekb: "1",
  cc_load_policy: "0",
  iv_load_policy: "3",
} as const;

//쿠키 없는 youtube-nocookie 임베드는 반복 접속 시 봇으로 걸려 플레이어가 부팅되지 않는다 — www.youtube.com을 쓴다.
//enablejsapi+origin을 실어야 IFrame API가 기존 iframe에 그대로 붙는다(없으면 API가 src를 고쳐 다시 로드한다)
const buildEmbedSrc = (videoId: string, origin: string) => {
  const params = new URLSearchParams({ ...PLAYER_VARS, playlist: videoId, enablejsapi: "1", origin });
  return `https://www.youtube.com/embed/${videoId}?${params}`;
};

//배경 장식 영상이라 자막을 끈다. playerVars의 cc_load_policy만으로는 시청자 기본 설정을 못 이기고,
//onReady 시점엔 캡션 모듈이 아직 로드 전이라 먹지 않는다 — 재생이 시작된 뒤에도 한 번 더 호출한다
const disableCaptions = (player: YouTubePlayer) => {
  player.unloadModule("captions");
  player.unloadModule("cc");
};

//window.location.origin은 페이지 수명 동안 바뀌지 않는다 — 구독은 빈 함수
const subscribeNoop = () => () => {};
const getBrowserOrigin = () => window.location.origin;

//IFrame API 스크립트는 문서당 한 번만 로드해 모든 호출이 같은 Promise를 공유한다
let iframeApiPromise: Promise<void> | null = null;

const loadIframeApi = () => {
  if (iframeApiPromise) return iframeApiPromise;

  iframeApiPromise = new Promise<void>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    //API는 준비되면 전역 콜백을 호출한다 — 기존 콜백이 있으면 함께 살려둔다
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    const script = document.createElement("script");
    script.src = IFRAME_API_URL;
    script.async = true;
    script.onerror = () => {
      iframeApiPromise = null;
      reject(new Error("유튜브 IFrame API 로드 실패"));
    };
    document.head.appendChild(script);
  });

  return iframeApiPromise;
};

//유튜브 최신 공식 영상을 배경으로 자동 재생하는 비주얼 히어로.
//iframe은 서버에서 렌더해 HTML 파싱 시점부터 로드가 시작되게 하고(하이드레이션·API 로드를 기다리지 않는다),
//IFrame API는 나중에 그 iframe에 붙어 재생 상태만 감시한다. iframe 수명은 React(key)가 쥔다.
const VisualSection = ({ videoId, siteOrigin }: VisualSectionProps) => {
  //재생이 실제로 시작되기 전까지 iframe을 투명하게 둔다 — 유튜브 플레이어가 자기 검은 배경을
  //깔아버려서, 그대로 두면 밑레이어의 썸네일 폴백이 정작 필요한 순간에 가려진다
  const [playing, setPlaying] = useState(false);
  //임베드 origin — 서버는 siteOrigin, 브라우저는 실제 origin. 둘이 다르면(로컬·프리뷰) 하이드레이션 직후
  //React가 다시 렌더해 iframe src를 바꾼다
  const origin = useSyncExternalStore(subscribeNoop, getBrowserOrigin, () => siteOrigin);
  //재시도 횟수 — iframe의 key라서 올릴 때마다 새 iframe이 만들어진다
  const [attempt, setAttempt] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  //API 스크립트를 하이드레이션과 병렬로 받아둔다
  if (videoId) preload(IFRAME_API_URL, { as: "script" });

  useEffect(() => {
    const iframe = iframeRef.current;
    //origin이 맞지 않는 iframe엔 API 메시지가 오가지 않는다 — 하이드레이션 재렌더가 고친 뒤 다시 돈다
    if (!videoId || !iframe || origin !== window.location.origin) return;

    let cancelled = false;

    const retry = () => {
      if (cancelled || attempt >= MAX_RETRY) return;
      setPlaying(false);
      setAttempt(attempt + 1);
    };

    //iframe은 이미 로드 중이라 API를 기다리지 않고 바로 타이머를 건다
    let bootTimer = setTimeout(retry, BOOT_TIMEOUT_MS);

    const attachPlayer = async () => {
      try {
        await loadIframeApi();
      } catch {
        return; //스크립트 자체가 막히면 썸네일 폴백 유지
      }
      if (cancelled || !window.YT) return;

      playerRef.current = new window.YT.Player(iframe, {
        events: {
          onReady: (event) => {
            disableCaptions(event.target);
            //API가 붙기 전에 이미 재생 중이면 onStateChange가 다시 오지 않는다 — 여기서 확인한다
            if (event.target.getPlayerState() === window.YT?.PlayerState.PLAYING) {
              clearTimeout(bootTimer);
              setPlaying(true);
              return;
            }
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.PLAYING) {
              clearTimeout(bootTimer);
              disableCaptions(event.target);
              setPlaying(true);
              return;
            }
            if (event.data === window.YT?.PlayerState.BUFFERING) {
              clearTimeout(bootTimer);
              bootTimer = setTimeout(retry, BUFFER_GRACE_MS);
            }
          },
          onError: () => {
            clearTimeout(bootTimer);
            retry();
          },
        },
      });
    };

    void attachPlayer();

    return () => {
      cancelled = true;
      clearTimeout(bootTimer);
      //destroy()는 iframe을 DOM에서 직접 떼어내 React의 제거와 충돌한다 — iframe은 key 교체·언마운트로
      //React가 지우므로 래퍼 참조만 버린다(사라진 iframe에서는 메시지가 더 오지 않는다)
      playerRef.current = null;
    };
  }, [videoId, origin, attempt]);

  return (
    <section className="h-[100dvh] lg:h-screen w-full relative overflow-hidden bg-gray-900 flex items-center justify-center">
      {videoId ? (
        <>
          {/* 영상 로드 전·실패 시 폴백 — 유튜브 썸네일이 항상 밑레이어에 깔린다 */}
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            fill
            priority
            className="object-cover"
            aria-hidden="true"
          />
          <div
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(100vw,177.78vh)] h-[max(100vh,56.25vw)] pointer-events-none transition-opacity duration-700",
              playing ? "opacity-100" : "opacity-0"
            )}
          >
            {origin && (
              <iframe
                key={attempt}
                ref={iframeRef}
                src={buildEmbedSrc(videoId, origin)}
                title="IVE 최신 공식 영상"
                allow="autoplay; encrypted-media; picture-in-picture"
                tabIndex={-1}
                className="w-full h-full"
              />
            )}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-main-image bg-cover bg-center" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {videoId && (
        <div className="absolute top-24 left-5 lg:top-28 lg:left-14 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E72424CC] backdrop-blur-sm text-white text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          OFFICIAL · 최신 영상 자동 재생
        </div>
      )}

      <div className="relative flex flex-col items-center text-center gap-5 px-5">
        <p className="text-xs lg:text-sm font-semibold tracking-[0.3em] text-purple-200">IVE FAN COMMUNITY</p>
        <h1 className="text-white font-bold text-4xl lg:text-[88px] lg:leading-none tracking-[-0.01em] [text-shadow:_1px_3px_12px_rgb(0_0_0_/_0.4)]">
          DIVE INTO IVE
        </h1>
        <p className="text-white/80 text-sm lg:text-lg">아이브의 일정 · 소식 · 음악 · 굿즈를 한곳에서</p>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/news"
            className="px-7 py-3.5 rounded-full bg-purple text-white text-sm lg:text-base font-semibold hover:opacity-90 transition-opacity"
          >
            최신 소식 보기
          </Link>
          <Link
            href="/discography"
            className="px-7 py-3.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm lg:text-base font-semibold hover:bg-white/25 transition-colors"
          >
            음악 듣기
          </Link>
        </div>
        <ChevronDown className="w-6 h-6 text-white/50 mt-8 animate-bounce" aria-hidden="true" />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0A0A0A]"
        aria-hidden="true"
      />
    </section>
  );
};

export default VisualSection;
