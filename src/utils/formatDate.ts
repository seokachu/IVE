type DateFormat = "dot" | "dash" | "slash";

export const formatDate = (dateString: string, format: DateFormat = "dot") => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const separators = {
    dot: ".",
    dash: "-",
    slash: "/",
  };

  return `${year}${separators[format]}${month}${separators[format]}${day}`;
};

//상대 시간 표기 (방금 전 · n분 전 · n시간 전 · 어제 · n일 전 · 날짜)
export const formatRelativeTime = (dateString: string) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;

  return formatDate(dateString, "dot");
};

//작성 시각이 기준 시간(시간 단위) 이내인지 여부
export const isWithinHours = (dateString: string, hours: number) => {
  return Date.now() - new Date(dateString).getTime() < hours * 60 * 60 * 1000;
};

export const formatPaymentDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};
