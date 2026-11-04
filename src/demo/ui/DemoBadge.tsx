import { App, Button, Flex, Grid, Popover, Typography } from "antd";
import { FlaskConical, RotateCcw, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetDemo } from "@/demo/storage";
import { useAuthStore } from "@/store/authStore";

const ROLE_LABELS: Record<string, string> = { student: "Öğrenci", moderator: "Moderatör", admin: "Yönetici" };

/** Always-visible marker that this is the demo, with role switching and reset. */
export default function DemoBadge() {
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { pathname } = useLocation();
  const isDesktop = Boolean(screens.lg);
  // EduAI and messages have a message box at the bottom; on phones the badge sits above it.
  const hasBottomComposer = pathname.startsWith("/edu-ai") || pathname.startsWith("/messages");
  const mobileBottom = hasBottomComposer ? 164 : 86;

  const switchRole = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const confirmReset = () => {
    modal.confirm({
      title: "Demo sıfırlansın mı?",
      content: "Bu tarayıcıda yaptığın tüm değişiklikler silinir ve örnek veriler baştan yüklenir.",
      okText: "Sıfırla",
      cancelText: "Vazgeç",
      onOk: resetDemo,
    });
  };

  const content = (
    <Flex vertical gap={12} style={{ maxWidth: 280 }}>
      <Typography.Text style={{ fontSize: 13, color: "#334155" }}>
        <strong>{user?.fullName}</strong> olarak geziyorsun ({ROLE_LABELS[user?.role ?? "student"]}). Bu bir tanıtım sürümü:
        sunucuya istek gitmez, değişiklikler bu tarayıcıda saklanır.
      </Typography.Text>
      <Flex gap={8} wrap>
        <Button size="small" icon={<Users size={14} />} onClick={() => void switchRole()}>Rol değiştir</Button>
        <Button size="small" danger icon={<RotateCcw size={14} />} onClick={confirmReset}>Demoyu sıfırla</Button>
      </Flex>
    </Flex>
  );

  return (
    <Popover content={content} title="Canlı demo" trigger="click" placement={isDesktop ? "topLeft" : "top"}>
      <button
        type="button"
        aria-label="Demo ayarları"
        style={{
          position: "fixed",
          left: isDesktop ? 20 : 12,
          bottom: isDesktop ? 96 : mobileBottom,
          zIndex: 1030,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          border: "1px solid #99F6E4",
          borderRadius: 999,
          background: "#F0FDFA",
          color: "#0F766E",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.12)",
        }}
      >
        <FlaskConical size={15} aria-hidden />
        Demo · {ROLE_LABELS[user?.role ?? "student"]}
      </button>
    </Popover>
  );
}
