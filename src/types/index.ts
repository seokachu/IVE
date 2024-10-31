import { Dispatch, SetStateAction } from "react";

export interface gnbArrayList {
  label: string;
  path: string;
}

export interface LoginModeProps {
  setIsLoginMode: Dispatch<SetStateAction<boolean>>;
}
