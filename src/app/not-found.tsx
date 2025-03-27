import Image from "next/image";
import Link from "next/link";
import NotFoundPageImage from "@/assets/images/sorry_image.avif";

const NotFound = () => {
  return (
    <main className="w-full min-h-screen flex justify-center items-center sm:-mt-20 md:mt-0">
      <section className="flex flex-col justify-center items-center gap-2 px-5">
        <div className="relative max-w-[300px] h-auto">
          <Image src={NotFoundPageImage} alt="not found image" className="fill" />
        </div>

        <h1 className="font-bold text-lg">죄송합니다. 잘못된 경로로 들어오셨습니다.</h1>
        <p className="text-slate-500 mb-5">잠시 후 다시 접속해 주세요.</p>
        <Link href="/" className="hover:text-purple">
          메인으로 이동하기
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
