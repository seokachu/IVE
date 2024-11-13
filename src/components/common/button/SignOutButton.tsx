import useSignOut from "@/hooks/useSignOut";

interface SignOutButtonProps {
  className?: string;
  onSuccess?: () => void;
}

const SignOutButton = ({ className, onSuccess }: SignOutButtonProps) => {
  const { handleSignOut } = useSignOut(onSuccess);

  return (
    <button onClick={handleSignOut} className={className}>
      로그아웃
    </button>
  );
};

export default SignOutButton;
