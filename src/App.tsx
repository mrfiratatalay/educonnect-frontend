import { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import FeedPage from "@/pages/Feed/FeedPage";
import VisualSearchPage from "@/pages/VisualSearch/VisualSearchPage";
import ExplorePage from "@/pages/Explore/ExplorePage";
import ProfilePage from "@/pages/Profile/ProfilePage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import { Spin, Flex } from "antd";

function RouteLoading() {
  return (
    <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
      <Spin size="large" />
    </Flex>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, status } = useAuthStore();

  if (status === "loading") {
    return <RouteLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, status } = useAuthStore();

  if (status === "loading") {
    return <RouteLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const hasBootstrappedRef = useRef(false);

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;
    void hydrateSession();
  }, [hydrateSession]);

  return (
    <Routes>
      <Route
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/visual-search" element={<VisualSearchPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
