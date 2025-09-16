import React from 'react';

interface ContextErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  componentName?: string;
}

class ContextErrorBoundary extends React.Component<
  ContextErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ContextErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const componentName = this.props.componentName || 'Renderer';
    console.warn(
      `${componentName} context error (expected if no StateProvider):`,
      error.message
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ContextErrorBoundary;
