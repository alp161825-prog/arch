import { Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

type RootErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class RootErrorBoundary extends Component<{ children: ReactNode }, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || "Unknown runtime error",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep browser console output for debugging while preventing full white screen.
    console.error("[RootErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[hsl(36,32%,95%)] px-6 py-10 text-[hsl(24,18%,16%)]">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[rgba(129,90,53,0.2)] bg-white/85 p-6 shadow-[0_12px_26px_rgba(122,86,52,0.14)]">
            <h1 className="text-2xl font-serif-cn font-bold">页面运行出错</h1>
            <p className="mt-3 text-sm leading-7 text-foreground/78">
              应用已拦截错误以避免白屏。请把浏览器控制台中的报错发给我，我会继续修复根因。
            </p>
            <pre className="mt-4 overflow-auto rounded-xl bg-[rgba(129,90,53,0.08)] p-3 text-xs leading-6">
              {this.state.message}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

const root = createRoot(rootElement);

const renderFatalError = (message: string) => {
  root.render(
    <div className="min-h-screen bg-[hsl(36,32%,95%)] px-6 py-10 text-[hsl(24,18%,16%)]">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[rgba(129,90,53,0.2)] bg-white/85 p-6 shadow-[0_12px_26px_rgba(122,86,52,0.14)]">
        <h1 className="text-2xl font-serif-cn font-bold">页面运行出错</h1>
        <p className="mt-3 text-sm leading-7 text-foreground/78">
          已拦截致命错误，避免白屏。请把这段错误信息发给我，我会继续修复根因。
        </p>
        <pre className="mt-4 overflow-auto rounded-xl bg-[rgba(129,90,53,0.08)] p-3 text-xs leading-6">{message}</pre>
      </div>
    </div>,
  );
};

root.render(
  <div className="min-h-screen bg-[hsl(36,32%,95%)] px-6 py-10 text-[hsl(24,18%,16%)]">
    <div className="mx-auto max-w-3xl rounded-2xl border border-[rgba(129,90,53,0.2)] bg-white/85 p-6 shadow-[0_12px_26px_rgba(122,86,52,0.14)]">
      <h1 className="text-2xl font-serif-cn font-bold">页面加载中</h1>
      <p className="mt-3 text-sm leading-7 text-foreground/78">正在初始化应用，请稍候。</p>
    </div>
  </div>,
);

window.addEventListener("error", event => {
  const message = event.error?.stack || event.message || "Unknown script error";
  console.error("[window.error]", event.error || event.message);
  renderFatalError(message);
});

window.addEventListener("unhandledrejection", event => {
  const reason = event.reason as unknown;
  const message =
    typeof reason === "string"
      ? reason
      : reason instanceof Error
        ? reason.stack || reason.message
        : JSON.stringify(reason);
  console.error("[unhandledrejection]", reason);
  renderFatalError(message || "Unhandled promise rejection");
});

import("./App.tsx")
  .then(({ default: App }) => {
    root.render(
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>,
    );
  })
  .catch(error => {
    const message = error?.stack || error?.message || String(error);
    console.error("[bootstrap.error]", error);
    renderFatalError(message);
  });
