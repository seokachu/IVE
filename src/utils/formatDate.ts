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
