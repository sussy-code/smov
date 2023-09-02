import { Component } from "react";
import { Trans } from "react-i18next";
import type { ReactNode } from "react-router-dom/node_modules/@types/react/index";

import { MWMediaMeta } from "@/backend/metadata/types/mw";
import { ErrorMessage } from "@/components/layout/ErrorBoundary";
import { Link } from "@/components/text/Link";
import { conf } from "@/setup/config";

import { VideoPlayerHeader } from "./VideoPlayerHeader";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: {
    name: string;
    description: string;
    path: string;
  };
}

interface VideoErrorBoundaryProps {
  children?: ReactNode;
  media?: MWMediaMeta;
  onGoBack?: () => void;
}

export class VideoErrorBoundary extends Component<
  VideoErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: VideoErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Render error caught", error, errorInfo);
    if (error instanceof Error) {
      const realError: Error = error as Error;
      this.setState((s) => ({
        ...s,
        hasError: true,
        error: {
          name: realError.name,
          description: realError.message,
          path: errorInfo.componentStack.split("\n")[1],
        },
      }));
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    // TODO make responsive, needs to work in tiny player

    return (
      <div className="absolute inset-0 bg-denim-100">
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col px-8 py-6 pb-2">
          <VideoPlayerHeader
            media={this.props.media}
            onClick={this.props.onGoBack}
          />
        </div>
        <ErrorMessage error={this.state.error} localSize>
          <Trans i18nKey="videoPlayer.errors.fatalError">
            <Link url={conf().DISCORD_LINK} newTab />
            <Link url={conf().GITHUB_LINK} newTab />
          </Trans>
        </ErrorMessage>
      </div>
    );
  }
}
