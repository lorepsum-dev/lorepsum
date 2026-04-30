export function validateUsername(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Username is required.";
  if (trimmed.length < 3) return "Username must be at least 3 characters.";
  return undefined;
}

export function validateEmail(value: string, required = true): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return required ? "Email is required." : undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return undefined;
}

export function validateConfirm(password: string, confirm: string): string | undefined {
  if (!confirm) return "Please confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return undefined;
}

export function validateUsernameOrEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your username or email.";
  if (trimmed.includes("@")) return validateEmail(trimmed);
  if (trimmed.length < 3) return "Must be at least 3 characters.";
  return undefined;
}
