import { Component } from "react";
import BrandedErrorPage from "@/components/BrandedErrorPage";

const DEFAULT_MESSAGE = "요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

const toSafeMessage = (error) => {
  if (!error) return DEFAULT_MESSAGE;
  const rawMessage =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof error?.message === "string"
          ? error.message
          : "";

  const message = rawMessage?.trim();
  if (!message) return DEFAULT_MESSAGE;
  if (/script error/i.test(message)) return DEFAULT_MESSAGE;
  return message;
};

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };

    this.handleWindowError = this.handleWindowError.bind(this);
    this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
    this.handleGlobalApiError = this.handleGlobalApiError.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("GlobalErrorBoundary caught render error:", error, info);
  }

  componentDidMount() {
    window.addEventListener("error", this.handleWindowError);
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
    window.addEventListener("bookchon-global-error", this.handleGlobalApiError);
  }

  componentWillUnmount() {
    window.removeEventListener("error", this.handleWindowError);
    window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
    window.removeEventListener("bookchon-global-error", this.handleGlobalApiError);
  }

  handleWindowError(event) {
    if (this.state.hasError) return;
    const error =
      event?.error instanceof Error
        ? event.error
        : new Error(event?.message || DEFAULT_MESSAGE);
    this.setState({ hasError: true, error });
  }

  handleUnhandledRejection(event) {
    if (this.state.hasError) return;
    const reason = event?.reason;
    const error =
      reason instanceof Error
        ? reason
        : new Error(typeof reason === "string" ? reason : DEFAULT_MESSAGE);
    this.setState({ hasError: true, error });
  }

  handleGlobalApiError(event) {
    if (this.state.hasError) return;
    const message = event?.detail?.message || DEFAULT_MESSAGE;
    const error = new Error(message);
    if (typeof event?.detail?.status === "number") {
      error.status = event.detail.status;
    }
    this.setState({ hasError: true, error });
  }

  handleReset() {
    this.setState({ hasError: false, error: null }, () => {
      window.location.reload();
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <BrandedErrorPage
          code="ERROR"
          title="서비스 이용 중 오류가 발생했습니다."
          description="예기치 못한 문제가 발생했습니다. 동일한 문제가 반복되면 관리자에게 문의해 주세요."
          detail={toSafeMessage(this.state.error)}
          primaryActionLabel="다시 시도"
          onPrimaryAction={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
