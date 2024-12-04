interface ButtonProps {
  variant: "primary" | "outline" | "default";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const ActionButton = ({
  variant,
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const baseStyles = "cursor-pointer rounded-md";
  const variantStyles = {
    primary: "bg-purple border border-purple text-white",
    outline: "border border-purple",
    default: "border hover:text-purple",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
