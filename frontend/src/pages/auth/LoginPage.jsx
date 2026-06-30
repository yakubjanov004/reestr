import { ArrowLeft, LogIn, Lock, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.jsx";
import { isOperator } from "../../auth/roles.js";
import LanguageSwitcher from "../../components/LanguageSwitcher.jsx";
import { useI18n } from "../../localization/i18n.jsx";

export default function LoginPage() {
  const { isAuthenticated, login, verifySmsLogin, user } = useAuth();
  const { t } = useI18n();
  const text = t.login;
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone_number: "", password: "" });
  const [smsCode, setSmsCode] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [focused, setFocused] = useState("");

  if (isAuthenticated) {
    return <Navigate to={isOperator(user) ? "/upload" : "/"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await login(form.phone_number, form.password);
      if (result.requires_sms) {
        setChallenge(result);
        setSmsCode("");
        return;
      }
      navigate(isOperator(result.user) ? "/upload" : "/");
    } catch (err) {
      setError(err.response?.data?.detail || text.invalidCredentials);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSmsSubmit(event) {
    event.preventDefault();
    if (!challenge) return;
    setVerifying(true);
    setError("");
    try {
      const loggedInUser = await verifySmsLogin(challenge.challenge_token, smsCode);
      navigate(isOperator(loggedInUser) ? "/upload" : "/");
    } catch (err) {
      setError(err.response?.data?.detail || text.codeError);
    } finally {
      setVerifying(false);
    }
  }

  function resetChallenge() {
    setChallenge(null);
    setSmsCode("");
    setError("");
  }

  return (
    <main className="login-screen">
      <div className="login-language-wrapper">
        <LanguageSwitcher compact={true} />
      </div>

      <div className="login-content">
        <section className="login-panel" aria-label="Datan login">
          <div className="login-panel-inner">
            <div className="login-logo-container">
              <img className="login-brand-logo" src="/logo.svg" alt="Datan" />
            </div>

            {!challenge ? (
              <form onSubmit={handleSubmit} className="login-form">
                <div className={`login-field${focused === "phone" ? " focused" : ""}`}>
                  <label htmlFor="login-phone">{text.phoneLabel}</label>
                  <div className="login-input-wrapper">
                    <Phone className="login-field-icon" size={17} />
                    <input
                      id="login-phone"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={text.phonePlaceholder}
                      value={form.phone_number}
                      onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                      onFocus={() => setFocused("phone")}
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
                  {submitting ? text.sendingCode : text.sendCode}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSmsSubmit} className="login-form">
                <div className="login-sms-summary">
                  <MessageSquare size={18} />
                  <span>{text.smsSent} {challenge.phone_number}</span>
                </div>

                {challenge.mock_code && (
                  <div className="login-mock-sms" role="status">
                    <span>{text.mockSmsCode}</span>
                    <strong>{challenge.mock_code}</strong>
                  </div>
                )}

                <div className={`login-field${focused === "sms" ? " focused" : ""}`}>
                  <label htmlFor="login-sms-code">{text.codeLabel}</label>
                  <div className="login-input-wrapper">
                    <MessageSquare className="login-field-icon" size={17} />
                    <input
                      id="login-sms-code"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder={text.codePlaceholder}
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      onFocus={() => setFocused("sms")}
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

                <button className="login-submit" type="submit" disabled={verifying}>
                  {verifying ? <span className="login-spinner" /> : <LogIn size={17} />}
                  {verifying ? text.verifyingCode : text.verifyCode}
                </button>

                <button className="login-back-button" type="button" onClick={resetChallenge}>
                  <ArrowLeft size={16} />
                  <span>{text.backToPhone}</span>
                </button>
              </form>
            )}

            <p className="login-support">
              {text.support} <strong>{text.supportPhone}</strong>
            </p>
          </div>
        </section>
      </div>

    </main>
  );
}
