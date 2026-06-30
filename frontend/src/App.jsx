import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./auth/AuthContext.jsx";
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_OPERATOR,
  ROLE_SUPERVISOR,
  canAccessDashboard,
  canUploadRecords,
  hasAnyRole,
  hasRoleAtLeast,
  isOperator
} from "./auth/roles.js";
import Layout from "./components/Layout.jsx";
import AnnouncementsPage from "./pages/operator/AnnouncementsPage.jsx";
import AuditLogsPage from "./pages/records/AuditLogsPage.jsx";
import BatchesPage from "./pages/records/BatchesPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import GuidePage from "./pages/common/GuidePage.jsx";
import HelpPage from "./pages/common/HelpPage.jsx";
import KpiPage from "./pages/operator/KpiPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import ManagerWorkspacePage from "./pages/management/ManagerWorkspacePage.jsx";
import RoleWorkspacePage from "./pages/management/RoleWorkspacePage.jsx";
import OperatorsPage from "./pages/management/OperatorsPage.jsx";
import ProfilePage from "./pages/common/ProfilePage.jsx";
import RecordsPage from "./pages/records/RecordsPage.jsx";
import UploadPage from "./pages/operator/UploadPage.jsx";
import SettingsPage from "./pages/common/SettingsPage.jsx";
import SupervisorMonitoringPage from "./pages/supervisor/SupervisorMonitoringPage.jsx";
import { useI18n } from "./localization/i18n.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return <div className="screen-message">{t.common.loading}</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function ManagementRoute({ children }) {
  const { user } = useAuth();
  return hasRoleAtLeast(user, ROLE_SUPERVISOR) ? children : <Navigate to={isOperator(user) ? "/upload" : "/"} replace />;
}

function RoleRoute({ minimumRole, children }) {
  const { user } = useAuth();
  return hasRoleAtLeast(user, minimumRole) ? children : <Navigate to={isOperator(user) ? "/upload" : "/"} replace />;
}

function AnyRoleRoute({ roles, children }) {
  const { user } = useAuth();
  return hasAnyRole(user, roles) ? children : <Navigate to={isOperator(user) ? "/upload" : "/"} replace />;
}

function UploadRoute({ children }) {
  const { user } = useAuth();
  return canUploadRecords(user) ? children : <Navigate to="/" replace />;
}

function HomeRoute() {
  const { user } = useAuth();
  if (isOperator(user)) {
    return <Navigate to="/upload" replace />;
  }
  return canAccessDashboard(user) ? <DashboardPage /> : <Navigate to="/upload" replace />;
}

export default function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRoute />} />
        <Route
          path="dashboard"
          element={
            <RoleRoute minimumRole={ROLE_OPERATOR}>
              <DashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="upload"
          element={
            <UploadRoute>
              <UploadPage />
            </UploadRoute>
          }
        />
        <Route
          path="kpi"
          element={
            <RoleRoute minimumRole={ROLE_OPERATOR}>
              <KpiPage />
            </RoleRoute>
          }
        />
        <Route
          path="announcements"
          element={
            <RoleRoute minimumRole={ROLE_OPERATOR}>
              <AnnouncementsPage />
            </RoleRoute>
          }
        />
        <Route path="records" element={<RecordsPage />} />
        <Route path="batches" element={<BatchesPage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route
          path="help"
          element={
            <RoleRoute minimumRole={ROLE_OPERATOR}>
              <HelpPage />
            </RoleRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path="operators"
          element={
            <ManagementRoute>
              <OperatorsPage />
            </ManagementRoute>
          }
        />
        <Route
          path="audit"
          element={
            <ManagementRoute>
              <AuditLogsPage />
            </ManagementRoute>
          }
        />
        <Route
          path="supervisor-monitoring"
          element={
            <ManagementRoute>
              <SupervisorMonitoringPage />
            </ManagementRoute>
          }
        />
        <Route
          path="manager"
          element={
            <AnyRoleRoute roles={[ROLE_MANAGER]}>
              <ManagerWorkspacePage />
            </AnyRoleRoute>
          }
        />
        <Route
          path="admin-panel"
          element={
            <AnyRoleRoute roles={[ROLE_ADMIN]}>
              <RoleWorkspacePage mode="admin" />
            </AnyRoleRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
