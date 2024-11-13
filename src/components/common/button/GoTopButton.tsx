"use client";
import { FaArrowCircleUp } from "react-icons/fa";

const GoTopButton = () => {
  return (
    <div className="fixed bottom-3 left-0 right-3 z-50">
      <div className="max-w-[1320px] m-auto relative">
        <button className="absolute right-3 bottom-3 lg:right-5 lg:bottom-14 hover:opacity-80 transition-opacity z-[999]">
          <FaArrowCircleUp
            size={40}
            className="bg-white rounded-full text-purple"
          />
        </button>
      </div>
    </div>
  );
};

export default GoTopButton;
