import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Avatar, Flex, Tag, Typography } from "antd";
import { ArrowRight } from "lucide-react";
import { getApiErrorMessage, login } from "@/features/auth/api";
import { DEMO_PASSWORD, DEMO_PERSONAS, type DemoPersona } from "@/demo/personas";
import { useAuthStore } from "@/store/authStore";

const REPO_URL = "https://github.com/mrfiratatalay/educonnect-backend";

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  width: "100%",
  padding: 14,
  textAlign: "left",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 14,
  cursor: "pointer",
  font: "inherit",
  color: "#0F172A",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2);

interface DemoAccessPanelProps {
  /** One column for the login dialog, a grid on the landing page. */
  compact?: boolean;
}

/** One-click, password-free entry for every role. Uses the normal login API with demo accounts. */
export default function DemoAccessPanel({ compact = false }: DemoAccessPanelProps) {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enter = async (persona: DemoPersona) => {
    setPendingId(persona.userId);
    setError(null);
    try {
      const session = await login({ email: persona.email, password: DEMO_PASSWORD });
      setSession(session);
      navigate("/", { replace: true });
    } catch (loginError) {
      setError(getApiErrorMessage(loginError));
      setPendingId(null);
    }
  };

  return (
    <section aria-label="Canlı demo" style={{ width: "100%", marginBottom: compact ? 24 : 28 }}>
      <Flex align="center" gap={8} wrap style={{ marginBottom: 12 }}>
        <Tag color="green" style={{ marginInlineEnd: 0, fontWeight: 600 }}>CANLI DEMO</Tag>
        <Typography.Text style={{ color: "#475569" }}>Şifresiz, tek tıkla bir rol seç</Typography.Text>
      </Flex>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 12,
        }}
      >
        {DEMO_PERSONAS.map((persona) => (
          <button
            key={persona.userId}
            type="button"
            disabled={pendingId !== null}
            onClick={() => void enter(persona)}
            onMouseEnter={() => setHoveredId(persona.userId)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              ...cardStyle,
              opacity: pendingId && pendingId !== persona.userId ? 0.55 : 1,
              borderColor: hoveredId === persona.userId ? "#5EEAD4" : "#E2E8F0",
              boxShadow: hoveredId === persona.userId ? "0 8px 22px rgba(13, 148, 136, 0.14)" : "none",
            }}
          >
            <Flex gap={12} align="center">
              <Avatar size={40} style={{ background: persona.color, flexShrink: 0 }}>{initials(persona.name)}</Avatar>
              <div style={{ minWidth: 0 }}>
                <Typography.Text strong style={{ display: "block", fontSize: 15 }}>{persona.role}</Typography.Text>
                <Typography.Text style={{ color: "#475569", fontSize: 13 }}>{persona.name}</Typography.Text>
              </div>
            </Flex>
            {compact ? null : (
              <Typography.Text style={{ color: "#334155", fontSize: 13, lineHeight: 1.5 }}>{persona.summary}</Typography.Text>
            )}
            <Flex justify="space-between" align="center" gap={8} wrap>
              <Flex gap={4} wrap>
                {persona.highlights.map((item) => (
                  <Tag key={item} style={{ marginInlineEnd: 0 }}>{item}</Tag>
                ))}
              </Flex>
              <Flex align="center" gap={4} style={{ color: "#0F766E", fontWeight: 600, fontSize: 13 }}>
                {pendingId === persona.userId ? "Giriliyor..." : "Bu rolle gir"}
                <ArrowRight size={15} aria-hidden />
              </Flex>
            </Flex>
          </button>
        ))}
      </div>

      {error ? <Alert type="error" showIcon title={error} style={{ marginTop: 12 }} /> : null}

      <Typography.Paragraph style={{ color: "#64748B", fontSize: 12, margin: "12px 0 0" }}>
        Bu bir tanıtım sürümüdür: sunucuya istek gitmez, yaptığın değişiklikler yalnızca bu tarayıcıda saklanır.
        Gerçek sistemin kodu ve dokümanları{" "}
        <Typography.Link href={REPO_URL} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>GitHub'da</Typography.Link>.
      </Typography.Paragraph>
    </section>
  );
}
