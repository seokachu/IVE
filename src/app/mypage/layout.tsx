import UserInfo from "@/components/mypage/UserInfo";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full min-h-screen">
      <div className="max-w-[1320px] m-auto flex flex-col lg:flex-row">
        <aside className="w-full lg:min-h-screen lg:w-[30%] lg:border-r px-5 pt-14 lg:px-8 ">
          <UserInfo />
        </aside>
        <section className="w-full lg:w-[70%]">{children}</section>
      </div>
    </main>
  );
};

export default layout;
