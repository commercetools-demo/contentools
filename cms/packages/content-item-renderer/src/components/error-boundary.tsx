import { Component } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class DynamicComponentErrorBoundary extends Component<
  {
    children: React.ReactNode;
    componentId: string;
    onError?: (error: Error) => void;
  },
  ErrorBoundaryState
> {
  private maxRetries = 2;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `Component ${this.props.componentId} error:`,
      error,
      errorInfo
    );

    // Handle chunk loading errors with automatic retry
    if (
      error.name === 'ChunkLoadError' &&
      this.state.retryCount < this.maxRetries
    ) {
      setTimeout(() => {
        this.setState((prevState) => ({
          hasError: false,
          error: null,
          retryCount: prevState.retryCount + 1,
        }));
        window.location.reload();
      }, 1000);
    }

    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            border: '2px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#ffe0e0',
            color: '#d63031',
            textAlign: 'center',
          }}
        >
          <h3>Component Failed to Load</h3>
          <p>Component ID: {this.props.componentId}</p>
          <p>Error: {this.state.error?.message}</p>
          {this.state.retryCount < this.maxRetries && (
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                border: '1px solid #d63031',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Retry ({this.state.retryCount + 1}/{this.maxRetries})
            </button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
