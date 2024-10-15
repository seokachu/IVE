const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <aside>게시판</aside>
      {children}
    </main>
  );
};

export default layout;
