"use client";
import { useEffect, useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

const GoTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY >= 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const onClickToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 left-0 right-3 z-50">
      <div className="max-w-[1320px] m-auto relative">
        <button
          onClick={onClickToTop}
          aria-label="최상단으로 이동"
          className="absolute right-3 bottom-3 lg:right-5 lg:bottom-14 hover:opacity-80 transition-opacity z-[999]"
        >
          <FaArrowCircleUp size={40} className="bg-white rounded-full text-purple" />
        </button>
      </div>
    </div>
  );
};

export default GoTopButton;
