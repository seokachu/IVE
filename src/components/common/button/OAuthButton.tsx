import { Button } from "@/components/ui/button";
import type { ComponentType } from "react";

interface OAuthButtonProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  text?: string;
  size?: number;
  className?: string;
  onClick: () => void;
  iconStyle?: string;
}

const OAuthButton = ({ icon: Icon, text, size = 20, className, onClick, iconStyle }: OAuthButtonProps) => {
  return (
    <Button variant="plain" size="auto" onClick={onClick} className={className}>
      <Icon size={size} className={iconStyle} />
      {text}
    </Button>
  );
};

export default OAuthButton;
