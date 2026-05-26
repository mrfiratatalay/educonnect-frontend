import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Flex, Result, Typography } from "antd";

const { Paragraph, Text } = Typography;

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Production'da burada Sentry/LogRocket gibi servise gonderim yapilabilir.
    console.error("[ErrorBoundary] caught:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Flex
        align="center"
        justify="center"
        style={{ minHeight: "100vh", padding: "16px", background: "#f5f5f5" }}
      >
        <Result
          status="error"
          title="Beklenmedik bir hata oluştu"
          subTitle="Üzgünüz, sayfa beklenmedik şekilde durdu. Sayfayı yenileyerek devam edebilirsin."
          extra={[
            <Button type="primary" key="reload" onClick={this.handleReload}>
              Sayfayı Yenile
            </Button>,
            <Button key="home" onClick={this.handleGoHome}>
              Anasayfa
            </Button>,
          ]}
        >
          {import.meta.env.DEV && this.state.error && (
            <div style={{ marginTop: 16, textAlign: "left" }}>
              <Paragraph>
                <Text strong>Hata Detayı (sadece geliştirme modunda görünür):</Text>
              </Paragraph>
              <Paragraph>
                <Text code copyable>
                  {this.state.error.message}
                </Text>
              </Paragraph>
              {this.state.error.stack && (
                <pre style={{ fontSize: 11, overflow: "auto", maxHeight: 240, background: "#fafafa", padding: 12 }}>
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}
        </Result>
      </Flex>
    );
  }
}
