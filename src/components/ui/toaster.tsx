"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { Check, CircleAlert, Info, TriangleAlert } from "lucide-react";

//시안 기준: 변형별 파스텔 아이콘 서클 — 성공·안내 보라 / 경고 주황 / 에러 연한 레드
const TOAST_ICONS = {
  default: { Icon: Info, circleClass: "bg-purple-50 text-purple-500" },
  success: { Icon: Check, circleClass: "bg-purple-50 text-purple-500" },
  warning: { Icon: TriangleAlert, circleClass: "bg-orange-100 text-orange-500" },
  destructive: { Icon: CircleAlert, circleClass: "bg-red-50 text-red dark:bg-red-400/15" },
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const { Icon, circleClass } = TOAST_ICONS[variant ?? "default"];
        return (
          <Toast key={id} variant={variant} {...props}>
            <span aria-hidden className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${circleClass}`}>
              <Icon size={17} />
            </span>
            <div className="grid gap-0.5">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
