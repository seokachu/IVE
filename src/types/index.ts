import { ButtonHTMLAttributes } from "react";
import { Tables } from "@/types/supabase";

export interface gnbArrayList {
  label: string;
  path: string;
}

export interface SignInProps {
  title?: string;
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
}

export interface classNameProps {
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
}

export type OAuthProvider = "google" | "github" | "kakao";

export interface AlbumItemProps {
  album: Tables<"album">;
}
