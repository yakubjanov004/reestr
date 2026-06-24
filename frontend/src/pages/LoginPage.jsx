import { LogIn, Signal, User, Lock } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";
import { useI18n } from "../localization/i18n.jsx";

export default function LoginPage() {
  const { isAuthenticated, login, user } = useAuth();
  const { t } = useI18n();
  const text = t.login;
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState("");

  if (isAuthenticated) {
    return <Navigate to={user?.role === "operator" ? "/upload" : "/"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const loggedInUser = await login(form.username, form.password);
      navigate(loggedInUser?.role === "operator" ? "/upload" : "/");
    } catch {
      setError(text.invalidCredentials);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-screen">
      <div className="login-language-wrapper">
        <LanguageSwitcher compact={true} />
      </div>

      <div className="login-content">
        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel-inner">
            <div className="login-logo-container">
              <span className="login-brand-icon">
                <Signal size={26} strokeWidth={2.5} />
              </span>
              <span className="login-brand-text">
                Da<span className="login-brand-accent">tan</span>
              </span>
            </div>

            <div className="login-heading">
              <h1 id="login-title" className="login-title">{text.title}</h1>
              <p className="login-subtitle">{text.tagline}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className={`login-field${focused === "username" ? " focused" : ""}`}>
                <label htmlFor="login-username">{text.usernameLabel}</label>
                <div className="login-input-wrapper">
                  <User className="login-field-icon" size={17} />
                  <input
                    id="login-username"
                    autoComplete="username"
                    placeholder={text.usernamePlaceholder}
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused("")}
                    required
                  />
                </div>
              </div>

              <div className={`login-field${focused === "password" ? " focused" : ""}`}>
                <label htmlFor="login-password">{text.passwordLabel}</label>
                <div className="login-input-wrapper">
                  <Lock className="login-field-icon" size={17} />
                  <input
                    id="login-password"
                    autoComplete="current-password"
                    type="password"
                    placeholder={text.passwordPlaceholder}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <span>!</span> {error}
                </div>
              )}

              <button
                className="login-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? <span className="login-spinner" /> : <LogIn size={17} />}
                {submitting ? text.submitting : text.submit}
              </button>
            </form>

            <p className="login-support">
              {text.support} <strong>{text.supportPhone}</strong>
            </p>
          </div>
        </section>
      </div>

      <footer className="login-footer">
        <strong>{t.common.version} 1.0.0</strong>
        <span>&copy; Datan {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
