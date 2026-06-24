export default function DashboardWelcome({ t, user }) {
  return (
    <header className="dashboard-header">
      <div>
        <h2 className="dashboard-welcome">
          {t.dashboard.introTitle},{" "}
          <span className="dashboard-welcome-name">
            {user?.full_name || user?.username || "User"}
          </span>
        </h2>
        <p className="dashboard-intro">{t.dashboard.intro}</p>
      </div>
    </header>
  );
}
