import ActionButton from "@/components/common/button/ActionButton";

const BoardActionButton = () => {
  return (
    <>
      <ActionButton
        variant="default"
        className="border-none text-gray-500 mr-1"
      >
        수정
      </ActionButton>
      <ActionButton variant="default" className="border-none text-gray-500">
        삭제
      </ActionButton>
    </>
  );
};

export default BoardActionButton;
