import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "./auth/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import AuditLogsPage from "./pages/AuditLogsPage.jsx";
import BatchesPage from "./pages/BatchesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OperatorsPage from "./pages/OperatorsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PrivacyRulesPage from "./pages/PrivacyRulesPage.jsx";
import RecordsPage from "./pages/RecordsPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { useI18n } from "./localization/i18n.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return <div className="screen-message">{t.common.loading}</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function ManagerRoute({ children }) {
  const { user } = useAuth();
  return user?.role === "manager" ? children : <Navigate to="/" replace />;
}

function HomeRoute() {
  const { user } = useAuth();
  return user?.role === "operator" ? <Navigate to="/upload" replace /> : <DashboardPage />;
}

export default function App() {
  useEffect(() => {
    function preventKeyboardZoom(event) {
      if (!event.ctrlKey && !event.metaKey) return;
      if (["+", "-", "=", "_", "0"].includes(event.key)) {
        event.preventDefault();
      }
    }

    function preventWheelZoom(event) {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", preventKeyboardZoom, { passive: false });
    window.addEventListener("wheel", preventWheelZoom, { passive: false });
    return () => {
      window.removeEventListener("keydown", preventKeyboardZoom);
      window.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

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
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="records" element={<RecordsPage />} />
        <Route path="batches" element={<BatchesPage />} />
        <Route path="privacy" element={<PrivacyRulesPage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path="operators"
          element={
            <ManagerRoute>
              <OperatorsPage />
            </ManagerRoute>
          }
        />
        <Route
          path="audit"
          element={
            <ManagerRoute>
              <AuditLogsPage />
            </ManagerRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
