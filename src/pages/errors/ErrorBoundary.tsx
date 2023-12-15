import { Component } from "react";

import { ErrorPart } from "@/pages/parts/errors/ErrorPart";

interface ErrorBoundaryState {
  error?: {
    error: any;
    errorInfo: any;
  };
}

export class ErrorBoundary extends Component<
  Record<string, unknown>,
  ErrorBoundaryState
> {
  constructor(props: { children: any }) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Render error caught", error, errorInfo);
    this.setState((s) => ({
      ...s,
      error: {
        error,
        errorInfo,
      },
    }));
  }

  render() {
    if (!this.state.error) return this.props.children as any;

    return (
      <ErrorPart
        error={this.state.error.error}
        errorInfo={this.state.error.errorInfo}
      />
    );
  }
}
