import { ErrorMessage } from "@/components/layout/ErrorBoundary";
import { Link } from "@/components/text/Link";
import { conf } from "@/setup/config";
import { Component, ReactNode } from "react";
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
  title?: string;
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
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col py-6 px-8 pb-2">
          <VideoPlayerHeader
            title={this.props.title}
            onClick={this.props.onGoBack}
          />
        </div>
        <ErrorMessage error={this.state.error} localSize>
          The video player encounted a fatal error, please report it to the{" "}
          <Link url={conf().DISCORD_LINK} newTab>
            Discord server
          </Link>{" "}
          or on{" "}
          <Link url={conf().GITHUB_LINK} newTab>
            GitHub
          </Link>
          .
        </ErrorMessage>
      </div>
    );
  }
}
