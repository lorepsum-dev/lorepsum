import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthField from "../components/AuthField";
import AuthShell from "../components/AuthShell";
import AuthSubmitButton from "../components/AuthSubmitButton";
import { SIGNIN_PATH } from "../model/authPaths";
import {
  validateConfirm,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../model/authValidation";

interface SignUpErrors {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: SignUpErrors = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirm(password, confirm),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

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
      eyebrow="Create account"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={SIGNIN_PATH}
            className="font-medium text-primary-light/90 transition-colors hover:text-primary-light"
          >
            Sign in
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
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          placeholder="you@realm.com"
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          placeholder="At least 6 characters"
        />
        <AuthField
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
          placeholder="Repeat password"
        />

        <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
      </form>
    </AuthShell>
  );
}

export default SignUpPage;
