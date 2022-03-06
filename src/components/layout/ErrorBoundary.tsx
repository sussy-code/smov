import { IconPatch } from "components/buttons/IconPatch";
import { Icons } from "components/Icon";
import { Link } from "components/text/Link";
import { Title } from "components/text/Title";
import { DISCORD_LINK, GITHUB_LINK } from "mw_constants";
import { Component } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: {
    name: string;
    description: string;
    path: string;
  };
}

export class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

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

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-start text-center">
          <IconPatch icon={Icons.WARNING} className="mb-6 text-red-400" />
          <Title>Whoops, it broke</Title>
          <p className="my-6 max-w-lg">
            The app encountered an error and wasn't able to recover, please
            report it to the <Link url={DISCORD_LINK} newTab>Discord server</Link> or on <Link url={GITHUB_LINK} newTab>GitHub</Link>.
          </p>
        </div>
        {this.state.error ? (
          <div className="bg-denim-300 w-4xl mt-12 max-w-full rounded px-6 py-4">
            <p className="mb-1 break-words font-bold text-white">
              {this.state.error.name} - {this.state.error.description}
            </p>
            <p className="break-words">{this.state.error.path}</p>
          </div>
        ) : null}
      </div>
    );
  }
}
