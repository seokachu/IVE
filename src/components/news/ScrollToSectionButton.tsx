"use client";
import ActionButton from "../common/button/ActionButton";

const ScrollToSectionButton = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center gap-5 flex-col lg:flex-row">
      <ActionButton
        onClick={() => scrollToSection("news_section")}
        variant="primary"
        className="px-8 py-4 !rounded-full font-bold"
      >
        Latest News
      </ActionButton>
      <ActionButton
        onClick={() => scrollToSection("gallery_section")}
        variant="default"
        className="px-8 py-4 !rounded-full bg-white font-bold"
      >
        View Gallery
      </ActionButton>
    </div>
  );
};

export default ScrollToSectionButton;
