export default function DashboardWelcome({ t, user, title, intro, scopeLabel }) {
  return (
    <header className="dashboard-header">
      <div>
        <h2 className="dashboard-welcome">
          {title || t.dashboard.introTitle},{" "}
          <span className="dashboard-welcome-name">
            {user?.full_name || user?.username || "User"}
          </span>
        </h2>
        <p className="dashboard-intro">{intro || t.dashboard.intro}</p>
      </div>
      {scopeLabel && <span className="dashboard-scope-badge">{scopeLabel}</span>}
    </header>
  );
}
