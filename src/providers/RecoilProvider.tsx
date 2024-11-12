"use client";
import { RecoilRoot } from "recoil";
import { AuthProvider } from "./AuthProvider";

const RecoilProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <AuthProvider>{children}</AuthProvider>
    </RecoilRoot>
  );
};

export default RecoilProvider;
