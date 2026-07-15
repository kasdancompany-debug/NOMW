"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { LargeTouchButton } from "@/components/touch/LargeTouchButton";
import { getAnalytics } from "@/lib/analytics";
import { silenceStationAudio } from "@/lib/media/audioManager";

type Props = {
  children: ReactNode;
  onReset?: () => void;
  exhibitTitle?: string;
};

type State = {
  hasError: boolean;
  message?: string;
};

/**
 * Catches render failures inside an exhibit so the floor never shows a stack dump.
 * Recovery prefers registered soft-reset handlers over a full page reload.
 */
export class ExhibitErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[exhibit]", error, info.componentStack);
    silenceStationAudio(true);
    getAnalytics().track("application_error");
  }

  private handleReset = () => {
    silenceStationAudio(true);
    this.setState({ hasError: false, message: undefined });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="safe-frame relative z-50 flex h-[100dvh] w-[100dvw] flex-col items-start justify-end bg-boreal-night">
        <p className="text-[length:var(--text-label)] tracking-[var(--tracking-wide)] text-[var(--color-museum-warm)] uppercase">
          {this.props.exhibitTitle ?? "Exhibit"}
        </p>
        <h2 className="mt-[var(--space-4)] font-[family-name:var(--font-display)] text-[length:var(--text-display-md)] text-[var(--text-on-dark)]">
          Something went quiet
        </h2>
        <p className="mt-[var(--space-4)] max-w-[36ch] text-[length:var(--text-body)] text-[var(--text-on-dark-muted)]">
          This station needs a moment to return home. Your visit can continue with a restart.
        </p>
        <div className="mt-[var(--space-8)]">
          <LargeTouchButton onClick={this.handleReset}>Return to start</LargeTouchButton>
        </div>
      </div>
    );
  }
}
