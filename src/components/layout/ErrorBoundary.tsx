import { Title } from "components/Text/Title";
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
      let realError: Error = error as Error;
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

    // TODO make pretty
    return (
      <div>
        <div>
          <Title>Whoops, it broke</Title>
          <p>
            The app encountered an error and wasn't able to recover, please
            report it to the discord server or on GitHub.
          </p>
        </div>
        {this.state.error ? (
          <div>
            <p className="txt-white">
              {this.state.error.name} - {this.state.error.description}
            </p>
            <p>{this.state.error.path}</p>
          </div>
        ) : null}
      </div>
    );
  }
}
