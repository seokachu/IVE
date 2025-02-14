import ActionButton from "@/components/common/button/ActionButton";

const BoardActionButton = () => {
  return (
    <div className="shrink-0">
      <ActionButton
        variant="default"
        className="border-none text-gray-500 mr-2"
      >
        수정
      </ActionButton>
      <ActionButton variant="default" className="border-none text-gray-500">
        삭제
      </ActionButton>
    </div>
  );
};

export default BoardActionButton;
