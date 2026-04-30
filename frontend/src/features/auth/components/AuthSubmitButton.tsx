import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

function AuthSubmitButton({
  loading,
  children,
  disabled,
  className,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary-light/45 bg-transparent px-4 py-3.5 font-display text-xs uppercase tracking-[0.28em] text-primary-light transition-all duration-200 hover:border-primary-light/70 hover:bg-primary-light/10 hover:text-primary-light hover:shadow-[0_0_30px_-6px_hsl(var(--primary-glow)/0.45)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span
            aria-hidden
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default AuthSubmitButton;
