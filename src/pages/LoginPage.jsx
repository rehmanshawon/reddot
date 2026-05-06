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
    <div className="login-page">
      <div className="auth-card">
        <img
          src="/logo-light.png"
          alt="RED DOT"
          style={{ height: "36px", marginBottom: "2rem" }}
        />
        <p className="section-header__eyebrow">ADMIN ACCESS</p>
        <h1>SIGN IN</h1>
        <p>Enter your credentials to manage site content.</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            EMAIL
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="admin@reddot.local"
              autoComplete="email"
            />
          </label>
          <label>
            PASSWORD
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button
            type="submit"
            className="button button--solid button--full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "SIGNING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
