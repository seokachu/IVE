import { Dispatch, SetStateAction } from "react";
import { ButtonHTMLAttributes } from "react";

export interface gnbArrayList {
  label: string;
  path: string;
}

export interface LoginModeProps {
  setIsLoginMode: Dispatch<SetStateAction<boolean>>;
}

export interface SignInProps {
  title?: string;
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
}

export interface classNameProps {
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
}

export type OAuthProvider = "google" | "github" | "kakao";
