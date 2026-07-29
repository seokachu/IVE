"use client";
import { Button } from "@/components/ui/button";

const ScrollToSectionButton = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center items-center gap-5 flex-col lg:flex-row">
      <Button
        onClick={() => scrollToSection("news_section")}
        size="auto"
        className="px-8 py-4 !rounded-full font-bold w-full md:w-[400px] lg:w-max"
      >
        Latest News
      </Button>
      <Button
        onClick={() => scrollToSection("gallery_section")}
        variant="outline" size="auto"
        className="px-8 py-4 !rounded-full bg-background font-bold w-full md:w-[400px] lg:w-max"
      >
        View Gallery
      </Button>
    </div>
  );
};

export default ScrollToSectionButton;
