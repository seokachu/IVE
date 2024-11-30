interface ButtonProps {
  variant: "primary" | "outline";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const ActionButton = ({
  variant,
  children,
  onClick,
  className,
}: ButtonProps) => {
  const baseStyles = "cursor-pointer rounded-md";
  const variantStyles = {
    primary: "bg-purple border border-purple text-white",
    outline: "border border-purple",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
