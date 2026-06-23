import { useEffect, useMemo, useState } from "react";
import { KeyRound, Languages, Monitor, Save, UserRound } from "lucide-react";

import api from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import { useI18n } from "../localization/i18n.jsx";

const emptyPasswordForm = {
  current_password: "",
  new_password: "",
  confirm_password: ""
};

function formatApiError(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return fallback;
  if (data.detail) return fallback;
  if (data.non_field_errors) return fallback;

  return Object.entries(data)
    .map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
      return `${field}: ${text}`;
    })
    .join(" ");
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useI18n();
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [profileStatus, setProfileStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || ""
    });
  }, [user]);

  const displayName = user?.full_name || user?.username || "";
  const initials = useMemo(() => {
    const source = displayName || "U";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [displayName]);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileStatus(null);
    try {
      const response = await api.patch("/users/me/", profileForm);
      updateUser(response.data);
      setProfileStatus({ type: "success", text: t.profile.profileSaved });
    } catch (err) {
      setProfileStatus({
        type: "error",
        text: formatApiError(err.response?.data, t.profile.profileSaveError)
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordStatus({ type: "error", text: t.profile.passwordMismatch });
      return;
    }

    setSavingPassword(true);
    try {
      await api.post("/users/me/password/", passwordForm);
      setPasswordForm(emptyPasswordForm);
      setPasswordStatus({ type: "success", text: t.profile.passwordUpdated });
    } catch (err) {
      setPasswordStatus({
        type: "error",
        text: formatApiError(err.response?.data, t.profile.passwordUpdateError)
      });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <section className="page-stack profile-page">
      <header className="profile-compact-header">
        <div className="profile-compact-title">
          <span className="section-kicker">{t.profile.heroKicker}</span>
          <h1>{t.profile.title}</h1>
          <p>{t.profile.description}</p>
        </div>
      </header>

      <div className="profile-grid">
        <div className="profile-side-stack">
          <section className="panel profile-card">
            <div className="profile-identity">
              <span className="profile-avatar">{initials}</span>
              <div>
                <h2>{displayName}</h2>
                <p>@{user?.username}</p>
                <span className="profile-email">{user?.email || t.common.notEntered}</span>
              </div>
            </div>
          </section>

          <section className="panel profile-language-panel">
            <div className="panel-heading">
              <div className="panel-title-with-icon">
                <Languages size={18} />
                <h2>{t.login.languagePickerLabel}</h2>
              </div>
            </div>
            <div className="profile-language-body">
              <LanguageSwitcher />
            </div>
          </section>

          <section className="panel profile-language-panel">
            <div className="panel-heading">
              <div className="panel-title-with-icon">
                <Monitor size={18} />
                <h2>Tizim ko'rinishi</h2>
              </div>
            </div>
            <div className="profile-language-body">
              <ThemeSwitcher />
            </div>
          </section>
        </div>

        <div className="profile-main-stack">
          <section className="panel profile-form-panel">
            <div className="panel-heading">
              <div className="panel-title-with-icon">
                <UserRound size={18} />
                <h2>{t.profile.personalInfo}</h2>
              </div>
            </div>

            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <label>
                {t.common.login}
                <input value={user?.username || ""} readOnly />
              </label>
              <label>
                {t.common.firstName}
                <input
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  placeholder={t.common.firstName}
                />
              </label>
              <label>
                {t.common.lastName}
                <input
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  placeholder={t.common.lastName}
                />
              </label>
              <label>
                {t.common.email}
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </label>

              {profileStatus && (
                <div className={`form-message ${profileStatus.type}`}>{profileStatus.text}</div>
              )}

              <button className="primary-button icon-button" type="submit" disabled={savingProfile}>
                <Save size={16} />
                <span>{savingProfile ? t.common.saving : t.common.save}</span>
              </button>
            </form>
          </section>

          <section className="panel profile-form-panel profile-password-panel">
            <div className="panel-heading">
              <div className="panel-title-with-icon">
                <KeyRound size={18} />
                <h2>{t.profile.changePassword}</h2>
              </div>
            </div>

            <form className="profile-form profile-password-form" onSubmit={handlePasswordSubmit}>
              <label>
                {t.profile.currentPassword}
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, current_password: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                {t.profile.newPassword}
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, new_password: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </label>
              <label>
                {t.profile.confirmPassword}
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </label>

              {passwordStatus && (
                <div className={`form-message ${passwordStatus.type}`}>{passwordStatus.text}</div>
              )}

              <button className="primary-button icon-button" type="submit" disabled={savingPassword}>
                <KeyRound size={16} />
                <span>{savingPassword ? t.profile.updating : t.profile.updatePassword}</span>
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
