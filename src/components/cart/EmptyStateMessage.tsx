interface EmptyStateMessageProps {
  title: string;
  message: string;
}

const EmptyStateMessage = ({ title, message }: EmptyStateMessageProps) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between border-b pb-4 mb-5">
        <h2 className="font-bold">{title}</h2>
      </div>
      <ul className="flex flex-col justify-between gap-2 text-sm">
        <li className="flex items-center justify-center flex-col gap-1 my-8">
          <h3>{message}</h3>
          <p>로그인 후 정보를 입력해주세요.</p>
        </li>
      </ul>
    </div>
  );
};

export default EmptyStateMessage;
