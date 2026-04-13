import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Invalid admin email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section auth-layout">
      <div className="auth-card">
        <p className="section-header__eyebrow">Admin Access</p>
        <h1>Sign in to manage site content</h1>
        <p>
          This is now connected to the backend API. Use your server-side admin credentials to
          access the dashboard.
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
          <button type="submit" className="button button--solid button--full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
