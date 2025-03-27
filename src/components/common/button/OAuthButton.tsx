import { IconType } from "react-icons/lib";

interface OAuthButtonProps {
  icon: IconType;
  text?: string;
  size?: number;
  className?: string;
  onClick: () => void;
  iconStyle?: string;
}

const OAuthButton = ({ icon: Icon, text, size = 20, className, onClick, iconStyle }: OAuthButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      <Icon size={size} className={iconStyle} />
      {text}
    </button>
  );
};

export default OAuthButton;
