import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, error, id, name, className, ...props }, ref) => {
    const inputId = id ?? name;
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          name={name}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full border-0 border-b bg-transparent px-0.5 py-2.5 font-mono text-[15px] tracking-[0.02em] text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-[border-color,box-shadow] duration-200",
            error
              ? "border-b-destructive/70"
              : "border-b-primary-light/25 focus:border-b-primary-light/80 focus:shadow-[0_1px_0_0_hsl(var(--primary-light)/0.5)]",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-destructive/90">
            {error}
          </p>
        )}
      </div>
    );
  },
);
AuthField.displayName = "AuthField";

export default AuthField;
