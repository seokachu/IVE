import type { EmptyStateMessageProps } from "@/types/cart";

const EmptyStateMessage = ({ title, message }: EmptyStateMessageProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-card p-6">
      <h2 className="text-[15px] font-bold">{title}</h2>
      <div className="my-7 flex flex-col items-center gap-1 text-sm">
        <h3>{message}</h3>
        <p className="text-[13px] text-gray-400">로그인 후 정보를 입력해주세요.</p>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
