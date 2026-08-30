"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PinkLogoImage from "@/assets/images/logo_pink.svg";

/**
 * APK 다운로드 페이지 본문 (`/download`).
 *
 * QR·공유 링크가 릴리스 파일을 직접 가리키면 **인앱 브라우저에서 설치가 막힌다** —
 * 카카오톡·QR 스캐너 등은 APK를 받아도 설치기로 넘겨주지 못해 "다운로드 중"에서
 * 영영 멈춘다. 그래서 링크는 이 페이지를 가리키고, 여기서 환경을 갈라 처리한다.
 *
 * - 카카오톡: `kakaotalk://web/openExternal` 스킴으로 이 페이지를 외부 브라우저에서 다시 연다
 * - 그 밖의 안드로이드 인앱(네이버 · 인스타그램 · 페이스북 · 라인): `intent://` 스킴으로 기본 브라우저를 연다
 * - 일반 브라우저: 바로 내려받기를 시작한다
 * - iOS: APK가 없다 — 홈 화면 추가(PWA) 안내로 대신한다
 *
 * 스킴이 무시되는 환경(구버전 · iOS 인앱)이 있으므로 자동 전환에만 기대지 않고
 * 수동 안내와 다운로드 버튼을 항상 함께 보여준다.
 */

//GitHub 릴리스 자산을 직접 가리킨다 (vidding-re · energy-meal 과 동일).
//한때 같은 도메인 프록시(/download/ive-dive.apk)로 우회했지만, 그 프록시는 Range 요청을
//처리하지 못해 폰이 네트워크 전환·화면 꺼짐 뒤 이어받기를 시도하는 순간 다운로드가 실패했다.
//GitHub CDN 은 206/Accept-Ranges 를 지원해 끊겨도 이어받는다.
const APK_URL = "https://github.com/seokachu/ive-app/releases/latest/download/ive-dive.apk";

type Env = "loading" | "inapp" | "ios" | "ready";

const ApkDownload = () => {
  const [env, setEnv] = useState<Env>("loading");

  useEffect(() => {
    const ua = navigator.userAgent;

    const isIos = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);

    let next: Env = "ready";
    let go: string | undefined = APK_URL;

    if (isIos) {
      next = "ios";
      go = undefined;
    } else if (/kakaotalk/i.test(ua)) {
      next = "inapp";
      go = "kakaotalk://web/openExternal?url=" + encodeURIComponent(window.location.href);
    } else if (/naver|instagram|fbav|fban|line\//i.test(ua)) {
      //한때 "; wv)"(안드로이드 WebView 공통 마커)까지 인앱으로 잡아 intent:// 로 넘겼는데,
      //이름 모를 WebView(카메라 QR 스캐너 등)는 intent 스킴을 처리하지 않아 "여는 중…"에서 멈췄다.
      //그냥 내려받기를 시작하면 대부분 WebView 도 다운로드를 시스템에 넘겨준다 (vidding-re · energy-meal 과 동일)
      next = "inapp";
      go = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;end`;
    }

    //effect 본문의 동기 setState는 렌더를 연쇄시키므로 한 틱 미룬다
    const timer = setTimeout(() => {
      setEnv(next);
      if (go) window.location.href = go;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <Image src={PinkLogoImage} alt="IVE DIVE" className="w-[88px]" priority />

      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold">IVE DIVE 앱 다운로드</h1>
        <p className="text-sm text-gray-500">
          {env === "ios"
            ? "iPhone·iPad는 APK 없이 웹에서 바로 설치해요"
            : env === "inapp"
              ? "외부 브라우저로 여는 중이에요…"
              : "잠시 후 다운로드가 자동으로 시작돼요"}
        </p>
      </div>

      {env === "ios" ? (
        <>
          <ol className="flex flex-col gap-1.5 text-sm">
            <li>1. 브라우저 하단(또는 주소창 옆)의 공유 버튼을 눌러요</li>
            <li>
              2. <strong className="font-semibold">홈 화면에 추가</strong>를 선택하면 아이콘이 생겨요
            </li>
          </ol>
          <Button asChild className="rounded-full px-8">
            <Link href="/">서비스 열기</Link>
          </Button>
        </>
      ) : (
        <>
          <Button asChild className="rounded-full px-8">
            <a href={APK_URL}>APK 다시 받기</a>
          </Button>
          <div className="flex flex-col gap-1.5 text-xs text-gray-400">
            <p>
              다운로드가 끝나도 설치로 넘어가지 않으면 오른쪽 위 ⋮ 메뉴에서{" "}
              <strong className="font-semibold text-gray-500">다른 브라우저(Chrome)로 열기</strong> 후 다시 받아주세요
            </p>
            <p>내려받은 파일을 열고 &ldquo;출처를 알 수 없는 앱&rdquo; 허용을 지나면 설치돼요</p>
          </div>
        </>
      )}
    </section>
  );
};

export default ApkDownload;
