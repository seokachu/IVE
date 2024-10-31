import { Dispatch, SetStateAction } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";

export interface gnbArrayList {
  label: string;
  path: string;
}

export interface LoginModeProps {
  setIsLoginMode: Dispatch<SetStateAction<boolean>>;
}
