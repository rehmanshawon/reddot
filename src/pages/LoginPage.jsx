import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const success = login(form);

    if (!success) {
      setError("Invalid admin email or password.");
      return;
    }

    const redirectTo = location.state?.from?.pathname || "/admin";
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="section auth-layout">
      <div className="auth-card">
        <p className="section-header__eyebrow">Admin Access</p>
        <h1>Sign in to manage site content</h1>
        <p>
          This is a frontend-only placeholder auth flow. We will replace it with secure NestJS
          authentication later.
        </p>
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="admin@reddot.local"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="reddot-admin"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="button button--solid button--full">
            Login
          </button>
        </form>
        <p className="auth-hint">
          Demo credentials: <strong>admin@reddot.local</strong> / <strong>reddot-admin</strong>
        </p>
      </div>
    </section>
  );
}
