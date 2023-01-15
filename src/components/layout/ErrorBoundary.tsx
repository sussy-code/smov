import { Component } from "react";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Link } from "@/components/text/Link";
import { Title } from "@/components/text/Title";
import { conf } from "@/setup/config";

interface ErrorShowcaseProps {
  error: {
    name: string;
    description: string;
    path: string;
  };
}

export function ErrorShowcase(props: ErrorShowcaseProps) {
  return (
    <div className="w-4xl mt-12 max-w-full rounded bg-denim-300 px-6 py-4">
      <p className="mb-1 break-words font-bold text-white">
        {props.error.name} - {props.error.description}
      </p>
      <p className="break-words">{props.error.path}</p>
    </div>
  );
}

interface ErrorMessageProps {
  error?: {
    name: string;
    description: string;
    path: string;
  };
  children?: React.ReactNode;
}

export function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center justify-start text-center">
        <IconPatch icon={Icons.WARNING} className="mb-6 text-red-400" />
        <Title>Whoops, it broke</Title>
        {props.children ? (
          props.children
        ) : (
          <p className="my-6 max-w-lg">
            The app encountered an error and wasn&apos;t able to recover, please
            report it to the{" "}
            <Link url={conf().DISCORD_LINK} newTab>
              Discord server
            </Link>{" "}
            or on{" "}
            <Link url={conf().GITHUB_LINK} newTab>
              GitHub
            </Link>
            .
          </p>
        )}
      </div>
      {props.error ? <ErrorShowcase error={props.error} /> : null}
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: {
    name: string;
    description: string;
    path: string;
  };
}

export class ErrorBoundary extends Component<
  Record<string, unknown>,
  ErrorBoundaryState
> {
  constructor(props: { children: any }) {
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
    if (!this.state.hasError) return this.props.children as any;

    return <ErrorMessage error={this.state.error} />;
  }
}
