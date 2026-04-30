import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthField from "../components/AuthField";
import AuthShell from "../components/AuthShell";
import AuthSubmitButton from "../components/AuthSubmitButton";
import { FORGOT_PASSWORD_PATH, SIGNUP_PATH } from "../model/authPaths";
import { validatePassword, validateUsername } from "../model/authValidation";

interface SignInErrors {
  username?: string;
  password?: string;
}

function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: SignInErrors = {
      username: validateUsername(username),
      password: validatePassword(password),
    };
    setErrors(next);
    if (next.username || next.password) return;

    setLoading(true);
    try {
      // TODO: connect to backend auth
      await new Promise((resolve) => setTimeout(resolve, 700));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      footer={
        <>
          New here?{" "}
          <Link
            to={SIGNUP_PATH}
            className="font-medium text-primary-light/90 transition-colors hover:text-primary-light"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          label="Username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          error={errors.username}
          placeholder="your_handle"
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          placeholder="••••••••"
        />

        <div className="flex justify-end">
          <Link
            to={FORGOT_PASSWORD_PATH}
            className="text-xs text-primary-light/80 transition-colors hover:text-primary-light"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton loading={loading}>Sign in</AuthSubmitButton>
      </form>
    </AuthShell>
  );
}

export default SignInPage;
