interface SectionTitleProps {
  title: string;
  subtitle: string;
  className?: string;
}

//메인·서브 페이지 공통 섹션 헤더
const SectionTitle = ({ title, subtitle, className }: SectionTitleProps) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className || ""}`}>
      <h2 className="text-2xl font-bold lg:text-4xl text-center">{title}</h2>
      <h3 className="text-center text-gray-500 text-sm lg:text-base">{subtitle}</h3>
    </div>
  );
};

export default SectionTitle;
