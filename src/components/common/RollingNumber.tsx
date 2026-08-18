"use client";
import { formatPrice } from "@/utils/calculateDiscount";

const DIGIT_STRIP = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

//토스 스타일 금액 롤링 — 값이 바뀌면 각 자릿수 기둥이 세로로 굴러 새 숫자에 멈춘다
//자릿수 키를 오른쪽(일의 자리) 기준으로 부여해, 총액 자릿수가 늘거나 줄어도 기존 기둥은 이어서 구른다
const RollingNumber = ({ value, className = "" }: { value: number; className?: string }) => {
  const chars = formatPrice(value).split("");

  return (
    <span className={`inline-flex tabular-nums ${className}`} aria-label={`${formatPrice(value)}`}>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, i) =>
          /\d/.test(char) ? (
            <span key={chars.length - i} className="inline-flex h-[1em] overflow-hidden">
              <span
                className="flex flex-col transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateY(-${Number(char)}em)` }}
              >
                {DIGIT_STRIP.map((digit) => (
                  <span key={digit} className="h-[1em] leading-none">
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={`sep-${chars.length - i}`} className="leading-none">
              {char}
            </span>
          )
        )}
      </span>
    </span>
  );
};

export default RollingNumber;
