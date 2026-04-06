import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import VerifyEmailPage from "@/pages/Auth/VerifyEmailPage";
import FeedPage from "@/pages/Feed/FeedPage";
import PostDetailPage from "@/pages/Feed/PostDetailPage";
import BookmarksPage from "@/pages/Bookmarks/BookmarksPage";
import EduAiPage from "@/pages/EduAI/EduAiPage";
import VisualSearchPage from "@/pages/VisualSearch/VisualSearchPage";
import CommunitiesPage from "@/pages/Communities/CommunitiesPage";
import CommunityDetailPage from "@/pages/Communities/CommunityDetailPage";
import EventsPage from "@/pages/Explore/EventsPage";
import ExploreDiscoveryPage from "@/pages/Explore/ExploreDiscoveryPage";
import ExploreTagPage from "@/pages/Explore/ExploreTagPage";
import MarketPage from "@/pages/Market/MarketPage";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import MessagesPage from "@/pages/Messages/MessagesPage";
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <RouteLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <RouteLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function RootRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <RouteLoading />;
  }

  if (isAuthenticated) {
    return (
      <AppLayout>
        <FeedPage />
      </AppLayout>
    );
  }

  return <AuthLayout />;
}

export default function App() {
  const hydrateSession = useAuthStore((state) => state.hydrateSession);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />

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
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/edu-ai" element={<EduAiPage />} />
        <Route path="/visual-search" element={<VisualSearchPage />} />
        <Route path="/explore" element={<ExploreDiscoveryPage />} />
        <Route path="/explore/tag/:tag" element={<ExploreTagPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/communities/:slug" element={<CommunityDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/discounts" element={<Navigate replace to="/market?tab=discounts" />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
