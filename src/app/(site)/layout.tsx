import { mainMetadata } from "@/metadata/mainMetadata";

export const metadata = mainMetadata;

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
