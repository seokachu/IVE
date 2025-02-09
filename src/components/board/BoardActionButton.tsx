import ActionButton from "@/components/common/button/ActionButton";

const BoardActionButton = () => {
  return (
    <div className="flex justify-end items-center gap-1 text-sm pt-3">
      <ActionButton
        variant="default"
        className="border-none text-gray-500 mr-1"
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
