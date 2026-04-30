import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthField from "../components/AuthField";
import AuthShell from "../components/AuthShell";
import AuthSubmitButton from "../components/AuthSubmitButton";
import { SIGNIN_PATH } from "../model/authPaths";
import { validateUsernameOrEmail } from "../model/authValidation";

function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationError = validateUsernameOrEmail(identifier);
    setError(validationError);
    if (validationError) return;

    setLoading(true);
    try {
      // TODO: connect to backend password reset
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Recover access"
      footer={
        <Link
          to={SIGNIN_PATH}
          className="font-medium text-primary-light/90 transition-colors hover:text-primary-light"
        >
          ← Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div
          role="status"
          className="rounded-xl border border-primary-light/30 bg-primary/10 p-4 text-sm text-primary-light/90"
        >
          If an account exists, a reset link has been sent.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <AuthField
            label="Username or email"
            name="identifier"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            error={error}
            placeholder="your_handle or you@realm.com"
          />
          <AuthSubmitButton loading={loading}>Send reset link</AuthSubmitButton>
        </form>
      )}
    </AuthShell>
  );
}

export default ForgotPasswordPage;
